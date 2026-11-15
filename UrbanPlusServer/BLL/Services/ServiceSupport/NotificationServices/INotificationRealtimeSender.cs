using DTO.NotificationDTO;

namespace BLL.Services.ServiceSupport.NotificationServices
{
    public interface INotificationRealtimeSender
    {
        Task SendToUserAsync(int userId, ShowNotificationDTO notification);
    }
}