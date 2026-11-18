
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
        Task<int> CreateEventStatusNotifications( int mainEventId,string eventTitle, string newStatus,IEnumerable<int> userIds);
        bool DeleteNotification(int id, int userId);
    }
}
