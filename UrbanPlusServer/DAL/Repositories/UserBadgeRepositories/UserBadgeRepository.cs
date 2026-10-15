using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.UserBadgeRepositories
{
    public class UserBadgeRepository : IUserBadgeRepository
    {
        private readonly UrbanPlusContext _context;

        public UserBadgeRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<UserBadges> GetByUserId(int userId)
        {
            return _context.UserBadges
                .AsNoTracking()
                .Include(ub => ub.Badge)
                .Where(ub => ub.UserId == userId)
                .ToList();
        }

        public UserBadges? GetById(int id)
        {
            return _context.UserBadges
                .AsNoTracking()
                .Include(ub => ub.Badge)
                .FirstOrDefault(ub => ub.UserBadgeId == id);
        }

        public bool ExistsForUserAndBadge(int userId, int badgeId)
        {
            return _context.UserBadges.Any(ub =>
                ub.UserId == userId &&
                ub.BadgeId == badgeId);
        }

        public UserBadges Add(UserBadges userBadge)
        {
            _context.UserBadges.Add(userBadge);
            _context.SaveChanges();

            // טעינת פרטי התג לצורך המיפוי ל-DTO
            userBadge.Badge = _context.Badges
                .FirstOrDefault(b => b.BadgeId == userBadge.BadgeId);

            return userBadge;
        }

        public bool Delete(int id)
        {
            var userBadge = _context.UserBadges.Find(id);

            if (userBadge == null)
                return false;

            _context.UserBadges.Remove(userBadge);
            _context.SaveChanges();

            return true;
        }
    }
}
