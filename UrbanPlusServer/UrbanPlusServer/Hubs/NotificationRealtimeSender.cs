
using BLL.Services.ServiceSupport.NotificationServices;
using DTO.NotificationDTO;
using Microsoft.AspNetCore.SignalR;
using UrbanPlusServer.Hubs;

namespace UrbanPlusServer.Services
{
    public class NotificationRealtimeSender : INotificationRealtimeSender
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationRealtimeSender(
            IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendToUserAsync(
            int userId,
            ShowNotificationDTO notification)
        {
            await _hubContext.Clients
                .Group($"user_{userId}")
                .SendAsync("ReceiveNotification", notification);
        }
    }
}
