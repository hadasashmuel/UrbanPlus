using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.NotificationRepositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly UrbanPlusContext _context;

        public NotificationRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Notifications> GetAllNotifications()
        {
            return _context.Notifications.AsNoTracking().ToList();
        }

        public List<Notifications> GetNotificationsByUserId(int userId)
        {
            return _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userId)
                .ToList();
        }

        public List<Notifications> GetUnreadNotificationsByUserId(int userId)
        {
            return _context.Notifications
                .AsNoTracking()
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToList();
        }

        public Notifications AddNotification(Notifications notification)
        {
            _context.Notifications.Add(notification);
            _context.SaveChanges();

            return notification;
        }

        public bool UpdateNotification(Notifications notification)
        {
            var existingNotification = _context.Notifications
                .FirstOrDefault(n =>
                    n.NotificationId == notification.NotificationId);

            if (existingNotification == null)
                return false;

            existingNotification.IsRead = notification.IsRead;
            existingNotification.Content = notification.Content;
            existingNotification.Type = notification.Type;
            existingNotification.DistanceFromEvent =notification.DistanceFromEvent;

            _context.SaveChanges();
            return true;
        }

        public bool MarkNotificationAsRead(int id, int userId)
        {
            var notification = _context.Notifications
                .FirstOrDefault(n =>
                    n.NotificationId == id &&
                    n.UserId == userId);

            if (notification == null)
                return false;

            notification.IsRead = true;

            _context.SaveChanges();
            return true;
        }

        public bool DeleteNotification(int id, int userId)
        {
            var notification = _context.Notifications
                .FirstOrDefault(n =>
                    n.NotificationId == id &&
                    n.UserId == userId);

            if (notification == null)
                return false;

            _context.Notifications.Remove(notification);
            _context.SaveChanges();

            return true;
        }
    }
}
