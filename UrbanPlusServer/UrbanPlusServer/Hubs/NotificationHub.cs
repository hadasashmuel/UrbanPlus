using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace UrbanPlusServer.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userIdValue = Context.User?.FindFirstValue(
                ClaimTypes.NameIdentifier);

            if (int.TryParse(userIdValue, out int userId))
            {
                await Groups.AddToGroupAsync( Context.ConnectionId, $"user_{userId}");
            }

            await base.OnConnectedAsync();
        }
    }
}
