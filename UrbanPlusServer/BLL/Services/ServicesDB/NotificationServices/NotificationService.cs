using AutoMapper;
using DAL.Repositories.NotificationRepositories;
using DTO.NotificationDTO;

namespace BLL.Services.ServicesDB.NotificationServices
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IMapper _mapper;

        public NotificationService(
            INotificationRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowNotificationDTO> GetAllNotifications()
        {
            var notifications = _repository.GetAllNotifications();

            return _mapper.Map<List<ShowNotificationDTO>>(notifications);
        }

        public List<ShowNotificationDTO> GetNotificationsByUserId(int userId)
        {
            var notifications =_repository.GetNotificationsByUserId(userId);

            return _mapper.Map<List<ShowNotificationDTO>>(notifications);
        }

        public List<ShowNotificationDTO> GetUnreadNotificationsByUserId(int userId)
        {
            var notifications = _repository.GetUnreadNotificationsByUserId(userId);

            return _mapper.Map<List<ShowNotificationDTO>>(notifications);
        }

        public bool MarkNotificationAsRead(int id, int userId)
        {
            return _repository.MarkNotificationAsRead(id, userId);
        }

        public bool DeleteNotification(int id, int userId)
        {
            return _repository.DeleteNotification(id, userId);
        }
    }
}
