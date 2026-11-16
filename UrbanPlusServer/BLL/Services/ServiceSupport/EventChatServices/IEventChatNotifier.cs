using DTO.MessageDTO;

namespace BLL.Services.ServiceSupport.EventChatServices
{
    public interface IEventChatNotifier
    {
        Task BroadcastMessageAsync(ShowMessageDTO message);
    }
}