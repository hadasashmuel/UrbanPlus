
using DTO.NotificationDTO;

namespace BLL.Services.ServicesDB.NotificationServices
{
    public interface INotificationService
    {
        List<ShowNotificationDTO> GetAllNotifications();

        List<ShowNotificationDTO> GetNotificationsByUserId(int userId);

        List<ShowNotificationDTO> GetUnreadNotificationsByUserId(int userId);

        bool MarkNotificationAsRead(int id, int userId);

        Task<int> CreateNearbyNotifications(int userId,   UserLocationDTO location);

        bool DeleteNotification(int id, int userId);
    }
}
