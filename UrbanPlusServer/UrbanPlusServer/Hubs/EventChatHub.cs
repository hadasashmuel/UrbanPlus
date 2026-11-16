
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace UrbanPlusServer.Hubs
{
    [Authorize]
    public class EventChatHub : Hub
    {
        // הצטרפות לקבוצת הצ'אט של אירוע
        public async Task JoinEventGroup(int mainEventId)
        {
            if (mainEventId <= 0)
                throw new HubException("Invalid event ID");

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"event_{mainEventId}");
        }

        // יציאה מקבוצת הצ'אט של אירוע
        public async Task LeaveEventGroup(int mainEventId)
        {
            if (mainEventId <= 0)
                throw new HubException("Invalid event ID");

            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                $"event_{mainEventId}");
        }
    }
}
