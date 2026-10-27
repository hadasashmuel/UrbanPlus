using AutoMapper;
using DAL.Entities;
using DAL.Repositories.BadgeRepositories;
using DAL.Repositories.UserBadgeRepositories;
using DAL.Repositories.UserRepositories;
using DTO.BadgeDTO;
using DTO.UserBadgeDTO;

namespace BLL.Services.ServicesDB.UserBadgeServices
{
    public class UserBadgeService : IUserBadgeService
    {
        private readonly IUserBadgeRepository _userBadgeRepository;
        private readonly IUserRepository _userRepository;
        private readonly IBadgeRepository _badgeRepository;
        private readonly IMapper _mapper;

        public UserBadgeService(  IUserBadgeRepository userBadgeRepository, IUserRepository userRepository,IBadgeRepository badgeRepository,IMapper mapper)
        {
            _userBadgeRepository = userBadgeRepository;
            _userRepository = userRepository;
            _badgeRepository = badgeRepository;
            _mapper = mapper;
        }

        public List<ShowUserBadgeDTO> GetBadgesByUserId(int userId)
        {
            if (_userRepository.GetById(userId) == null)
                throw new KeyNotFoundException("User not found.");

            var userBadges = _userBadgeRepository.GetByUserId(userId);

            return _mapper.Map<List<ShowUserBadgeDTO>>(userBadges);
        }

        public ShowUserBadgeDTO? GetUserBadgeById(int id)
        {
            var userBadge = _userBadgeRepository.GetById(id);

            if (userBadge == null)
                return null;

            return _mapper.Map<ShowUserBadgeDTO>(userBadge);
        }
        public List<ShowBadgeDTO> GetMine(int userId)
        {
            return _mapper.Map<List<ShowBadgeDTO>>( _userBadgeRepository.GetByUserId(userId));
        }

        public ShowUserBadgeDTO AwardBadgeToUser(int userId, int badgeId)
        {
            if (_userRepository.GetById(userId) == null)
                throw new KeyNotFoundException("User not found.");

            if (_badgeRepository.GetBadgeById(badgeId) == null)
                throw new KeyNotFoundException("Badge not found.");

            if (_userBadgeRepository.ExistsForUserAndBadge(userId, badgeId))
                throw new InvalidOperationException("The user already has this badge.");

            var userBadge = new UserBadges
            {
                UserId = userId,
                BadgeId = badgeId,
                CreatedAt = DateTime.Now
            };

            var created = _userBadgeRepository.Add(userBadge);

            return _mapper.Map<ShowUserBadgeDTO>(created);
        }

        public bool DeleteUserBadge(int id)
        {
            return _userBadgeRepository.Delete(id);
        }
    }
}
