using DTO.NotificationDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.NotificationServices
{
    public interface INotificationService
    {
        List<ShowNotificationDTO> GetAllNotifications();
        List<ShowNotificationDTO> GetNotificationsByUserId(int userId);
        List<ShowNotificationDTO> GetUnreadNotificationsByUserId(int userId);
        bool MarkNotificationAsRead(int id, int userId);
        bool DeleteNotification(int id, int userId);
    }
}
