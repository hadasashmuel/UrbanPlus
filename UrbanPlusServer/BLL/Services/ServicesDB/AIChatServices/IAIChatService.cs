
using DTO.AIChatMessagesDTO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Services.ServicesDB.AIChatServices
{
    public interface IAIChatService
    {
        Task<AIChatMessageResponseDTO> SendMessage(int userId, SendAIMessageDTO dto);

        IAsyncEnumerable<AIChatStreamChunkDTO> StreamMessage( int userId, SendAIMessageDTO dto, CancellationToken cancellationToken = default);
    }
}
