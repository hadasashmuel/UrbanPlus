using AutoMapper;
using DAL.Entities;
using DAL.Repositories.MainEventRepositories;
using DAL.Repositories.NotificationRepositories;
using DTO.NotificationDTO;

namespace BLL.Services.ServicesDB.NotificationServices
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IMapper _mapper;
        private readonly IMainEventRepository _mainEventRepository;
        private const double NotificationRadiusKm = 2;

        public NotificationService(INotificationRepository notificationRepository, IMapper mapper, IMainEventRepository mainEventRepository)
        {
            _repository = notificationRepository;
            _mapper = mapper;
            _mainEventRepository = mainEventRepository;
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
        private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double earthRadius = 6371000;

            double dLat = (lat2 - lat1) * Math.PI / 180;
            double dLon = (lon2 - lon1) * Math.PI / 180;

            double a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) *
                Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            double c = 2 * Math.Atan2(
                Math.Sqrt(a),
                Math.Sqrt(1 - a));

            return earthRadius * c;
        }
        public int CreateNearbyNotifications(int userId, UserLocationDTO location)
        {
            if (location == null)
                throw new ArgumentNullException(nameof(location));

            if (location.Latitude < -90 || location.Latitude > 90 ||
                location.Longitude < -180 || location.Longitude > 180)
                throw new ArgumentException("Invalid user location");

            var events = _mainEventRepository.GetOpenMainEvents();

            int notificationsCreated = 0;

            foreach (var mainEvent in events)
            {
                double distance = CalculateDistance(
                    location.Latitude,
                    location.Longitude,
                    mainEvent.Latitude,
                    mainEvent.Longitude);

                double distanceKm = distance / 1000;

                if (distanceKm > NotificationRadiusKm)
                    continue;

                bool alreadyExists =
                    _repository.ExistsNearbyNotification(
                        userId,
                        mainEvent.MainEventsId);

                if (alreadyExists)
                    continue;

                var notification = new Notifications
                {
                    UserId = userId,
                    MainEventId = mainEvent.MainEventsId,
                    Type = NotificationType.NearbyEvent,
                    Content = $"אירוע חדש בקרבתך: {mainEvent.Title}",
                    DistanceFromEvent = distanceKm,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow
                };

                _repository.AddNotification(notification);

                notificationsCreated++;
            }

            return notificationsCreated;
        }
        public bool DeleteNotification(int id, int userId)
        {
            return _repository.DeleteNotification(id, userId);
        }
    }
}
