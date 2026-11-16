
using BLL.Services.ServiceSupport.EventChatServices;
using DTO.MessageDTO;
using Microsoft.AspNetCore.SignalR;

namespace UrbanPlusServer.Hubs
{
    public class EventChatNotifier : IEventChatNotifier
    {
        private readonly IHubContext<EventChatHub> _hubContext;

        public EventChatNotifier(
            IHubContext<EventChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task BroadcastMessageAsync(ShowMessageDTO message)
        {
            await _hubContext.Clients
                .Group($"event_{message.MainEventId}")
                .SendAsync("ReceiveMessage", message);
        }
    }
}
