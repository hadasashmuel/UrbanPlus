using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.NotificationDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.NotificationRepositories
{
    public class NotificationRepositories: INotificationRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public NotificationRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // החזרת כל ההתראות
        public List<ShowNotificationDTO> GetAllNotifications()
        {
            return _context.Notifications
                .ProjectTo<ShowNotificationDTO>(_mapper.ConfigurationProvider)
                .ToList();
        }

        // החזרת ההתראות של משתמש מסוים
        public List<ShowNotificationDTO> GetNotificationsByUserId(int userId)
        {
            return _context.Notifications
                .Where(n => n.UserId == userId)
                .ProjectTo<ShowNotificationDTO>(_mapper.ConfigurationProvider)
                .ToList();
        }

        // החזרת ההתראות שלא נקראו של משתמש מסוים
        public List<ShowNotificationDTO> GetUnreadNotificationsByUserId(int userId)
        {
            return _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ProjectTo<ShowNotificationDTO>(_mapper.ConfigurationProvider)
                .ToList();
        }

        // יצירת התראה
        public void CreateNotification(Notifications notification)
        {
            _context.Notifications.Add(notification);
            _context.SaveChanges();
        }

        // עדכון התראה — למשל סימון כנקראה
        public void UpdateNotification(Notifications notification)
        {
            _context.Notifications.Update(notification);
            _context.SaveChanges();
        }

        // מחיקת התראה
        public bool DeleteNotification(int id)
        {
            var notification = _context.Notifications
                .FirstOrDefault(n => n.NotificationId == id);

            if (notification != null)
            {
                _context.Notifications.Remove(notification);
                _context.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
