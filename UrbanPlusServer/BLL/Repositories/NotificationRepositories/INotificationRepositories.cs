using DAL;
using DTO.CategoryDTO;
using DTO.NotificationDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.NotificationRepositories
{
    public interface INotificationRepositories
    {
        List<ShowNotificationDTO> GetAllNotifications();
        List<ShowNotificationDTO> GetNotificationsByUserId(int userId);
        List<ShowNotificationDTO> GetUnreadNotificationsByUserId(int userId);

        void CreateNotification(Notifications notification);
        void UpdateNotification(Notifications notification);
        bool DeleteNotification(int id);
    }
}
