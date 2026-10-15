
using DAL.Entities;

namespace DAL.Repositories.NotificationRepositories
{
    public interface INotificationRepository
    {
        List<Notifications> GetAllNotifications();
        List<Notifications> GetNotificationsByUserId(int userId);
        List<Notifications> GetUnreadNotificationsByUserId(int userId);
        Notifications AddNotification(Notifications notification);
        bool UpdateNotification(Notifications notification);
        bool MarkNotificationAsRead(int id, int userId);
        bool DeleteNotification(int id, int userId);
    }
}
