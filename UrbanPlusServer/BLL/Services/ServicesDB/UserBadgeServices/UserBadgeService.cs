
using AutoMapper;
using DAL.Repositories.UserBadgeRepositories;
using DTO.UserBadgeDTO;

namespace BLL.Services.ServicesDB.UserBadgeServices
{
    public class UserBadgeService : IUserBadgeService
    {
        private readonly IUserBadgeRepository _userBadgeRepository;
        private readonly IMapper _mapper;

        public UserBadgeService(IUserBadgeRepository userBadgeRepository,IMapper mapper)
        {
            _userBadgeRepository = userBadgeRepository;
            _mapper = mapper;
        }

        public List<ShowUserBadgeDTO> GetAllUserBadges()
        {
            var userBadges = _userBadgeRepository.GetAll();

            return _mapper.Map<List<ShowUserBadgeDTO>>(userBadges);
        }

        public ShowUserBadgeDTO? GetUserBadgeById(int id)
        {
            var userBadge = _userBadgeRepository.GetById(id);

            if (userBadge == null)
                return null;

            return _mapper.Map<ShowUserBadgeDTO>(userBadge);
        }

        public bool DeleteUserBadge(int id)
        {
            return _userBadgeRepository.Delete(id);
        }
    }
}
