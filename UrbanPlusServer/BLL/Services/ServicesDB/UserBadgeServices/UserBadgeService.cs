
using AutoMapper;
using BLL.Exceptions;
using DAL.Entities;
using DAL.Repositories.BadgeRepositories;
using DAL.Repositories.UserBadgeRepositories;
using DAL.Repositories.UserRepositories;
using DTO.BadgeDTO;
using DTO.UserBadgeDTO;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services.ServicesDB.UserBadgeServices
{
    public class UserBadgeService : IUserBadgeService
    {
        private readonly IUserBadgeRepository _userBadgeRepository;
        private readonly IUserRepository _userRepository;
        private readonly IBadgeRepository _badgeRepository;
        private readonly IMapper _mapper;
        private readonly UrbanPlusContext _context;

        public UserBadgeService( IUserBadgeRepository userBadgeRepository,IUserRepository userRepository,  IBadgeRepository badgeRepository, IMapper mapper, UrbanPlusContext context)
        {
            _userBadgeRepository = userBadgeRepository;
            _userRepository = userRepository;
            _badgeRepository = badgeRepository;
            _mapper = mapper;
            _context = context;
        }

        public List<ShowUserBadgeDTO> GetBadgesByUserId(int userId)
        {
            if (_userRepository.GetById(userId) == null)
                throw new KeyNotFoundException("User not found.");

            var userBadges = _userBadgeRepository.GetByUserId(userId);

            return _mapper.Map<List<ShowUserBadgeDTO>>(userBadges);
        }

        public ShowUserBadgeDTO GetUserBadgeById(int id)
        {
            var userBadge = _userBadgeRepository.GetById(id);

            if (userBadge == null)
                throw new NotFoundException(
                    $"userBadge with id {id} was not found");

            return _mapper.Map<ShowUserBadgeDTO>(userBadge);
        }

        public List<ShowBadgeDTO> GetMine(int userId)
        {
            return _mapper.Map<List<ShowBadgeDTO>>(
                _userBadgeRepository.GetByUserId(userId));
        }

        public ShowUserBadgeDTO AwardBadgeToUser(int userId, int badgeId)
        {
            if (_userRepository.GetById(userId) == null)
                throw new KeyNotFoundException("User not found.");

            if (_badgeRepository.GetBadgeById(badgeId) == null)
                throw new KeyNotFoundException("Badge not found.");

            if (_userBadgeRepository.ExistsForUserAndBadge(userId, badgeId))
                throw new InvalidOperationException(
                    "The user already has this badge.");

            var userBadge = new UserBadges
            {
                UserId = userId,
                BadgeId = badgeId,
                CreatedAt = DateTime.UtcNow
            };

            var created = _userBadgeRepository.Add(userBadge);

            return _mapper.Map<ShowUserBadgeDTO>(created);
        }


        public void CheckAndAwardBadges(int userId)
        {
            var user = _userRepository.GetById(userId);

            if (user == null)
                throw new KeyNotFoundException("User not found.");

            int reportsCount = _context.Reports
                .Count(r => r.UserId == userId);

            int votesCount = _context.Votes
                .Count(v => v.UserId == userId);

            int savedEventsCount = _context.SavedEvents
                .Count(s => s.UserId == userId);

            double reliability = user.ScoreReliability;

            DateTime now = DateTime.UtcNow;
            DateTime createdAt = user.CreatedAt;

            // כל התגים שהמשתמש זכאי לקבל
            var earnedBadgeNames = new List<string>();

            // דיווחים
            if (reportsCount >= 1)
                earnedBadgeNames.Add("עין עירונית");

            if (reportsCount >= 5)
                earnedBadgeNames.Add("מדווח פעיל");

            if (reportsCount >= 15)
                earnedBadgeNames.Add("שומר העיר");

            if (reportsCount >= 30)
                earnedBadgeNames.Add("גיבור העיר");

            // הצבעות - כל סוגי ההצבעות נספרים
            if (votesCount >= 5)
                earnedBadgeNames.Add("קול ראשון");

            if (votesCount >= 20)
                earnedBadgeNames.Add("קול משפיע");

            if (votesCount >= 50)
                earnedBadgeNames.Add("קול מוביל");

            if (votesCount >= 100)
                earnedBadgeNames.Add("קול העיר");

            // אמינות
            if (reliability >= 60)
                earnedBadgeNames.Add("אמין");

            if (reliability >= 75)
                earnedBadgeNames.Add("ראוי לאמון");

            if (reliability >= 90)
                earnedBadgeNames.Add("אמינות גבוהה");

            if (reliability >= 98)
                earnedBadgeNames.Add("מודל לאמינות");

            // אירועים שמורים
            if (savedEventsCount >= 1)
                earnedBadgeNames.Add("מתעניין");

            if (savedEventsCount >= 5)
                earnedBadgeNames.Add("עוקב עירוני");

            if (savedEventsCount >= 10)
                earnedBadgeNames.Add("מחובר לקהילה");

            if (savedEventsCount >= 25)
                earnedBadgeNames.Add("לב הקהילה");

            // ותק - בדיקה לפי תאריך קלנדרי
            if (createdAt <= now.AddMonths(-1))
                earnedBadgeNames.Add("הצטרף לקהילה");

            if (createdAt <= now.AddMonths(-6))
                earnedBadgeNames.Add("חבר ותיק");

            if (createdAt <= now.AddYears(-1))
                earnedBadgeNames.Add("חלק מהעיר");

            if (createdAt <= now.AddYears(-2))
                earnedBadgeNames.Add("ותיק הקהילה");

            if (earnedBadgeNames.Count == 0)
                return;

            // שליפת התגים האמיתיים מהמסד לפי השמות שלהם
            var badges = _context.Badges
                .Where(b => earnedBadgeNames.Contains(b.BadgeName))
                .ToList();

            // לוודא שכל התגים שהמשתמש זכאי להם קיימים בטבלה
            var missingBadges = earnedBadgeNames
                .Except(badges.Select(b => b.BadgeName))
                .ToList();

            if (missingBadges.Count > 0)
            {
                throw new InvalidOperationException(
                    "The following badges are missing from the database: " +
                    string.Join(", ", missingBadges));
            }

            // התגים שכבר קיימים אצל המשתמש
            var existingBadgeIds = _context.UserBadges
                .Where(ub => ub.UserId == userId)
                .Select(ub => ub.BadgeId)
                .ToHashSet();

            // הענקת כל התגים החדשים
            var newBadges = badges
                .Where(b => !existingBadgeIds.Contains(b.BadgeId))
                .Select(b => new UserBadges
                {
                    UserId = userId,
                    BadgeId = b.BadgeId,
                    CreatedAt = now
                })
                .ToList();

            if (newBadges.Count == 0)
                return;

            _context.UserBadges.AddRange(newBadges);
            _context.SaveChanges();
        }



        public bool DeleteUserBadge(int id)
        {
            return _userBadgeRepository.Delete(id);
        }
    }
}
