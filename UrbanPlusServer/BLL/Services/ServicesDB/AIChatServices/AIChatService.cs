
using BLL.Exceptions;
using DAL.Entities;
using DAL.Repositories.AIChatRepositories;
using DTO.AIChatMessagesDTO;
using Microsoft.Extensions.AI;
using System.Runtime.CompilerServices;
using System.Text;

namespace BLL.Services.ServicesDB.AIChatServices
{
    public class AIChatService : IAIChatService
    {
        private readonly IAIChatRepository _repository;
        private readonly IChatClient _chatClient;

        public AIChatService(
            IAIChatRepository repository,
            IChatClient chatClient)
        {
            _repository = repository;
            _chatClient = chatClient;
        }

        public async Task<AIChatMessageResponseDTO> SendMessage(
            int userId,
            SendAIMessageDTO dto)
        {
            var (session, chatMessages) = PrepareConversation(userId, dto);

            var response = await _chatClient.GetResponseAsync(chatMessages);

            var aiContent = response.Text;

            if (string.IsNullOrWhiteSpace(aiContent))
                throw new InvalidOperationException(
                    "AI returned an empty response.");

            var aiMessage = new AIChatMessages
            {
                AIChatSessionId = session.AIChatSessionId,
                SenderType = SenderType.AI,
                Content = aiContent,
                CreatedAt = DateTime.UtcNow
            };

            _repository.AddMessage(aiMessage);

            return new AIChatMessageResponseDTO
            {
                AIChatMessageId = aiMessage.AIChatMessageId,
                SenderType = aiMessage.SenderType,
                Content = aiMessage.Content,
                CreatedAt = aiMessage.CreatedAt
            };
        }

        public async IAsyncEnumerable<AIChatStreamChunkDTO> StreamMessage(
            int userId,
            SendAIMessageDTO dto,
            [EnumeratorCancellation]
            CancellationToken cancellationToken = default)
        {
            var (session, chatMessages) = PrepareConversation(userId, dto);

            var fullResponse = new StringBuilder();

            await foreach (var update in _chatClient.GetStreamingResponseAsync(
                chatMessages,
                cancellationToken: cancellationToken))
            {
                if (!string.IsNullOrEmpty(update.Text))
                {
                    fullResponse.Append(update.Text);

                    yield return new AIChatStreamChunkDTO
                    {
                        AIChatSessionId = session.AIChatSessionId,
                        Content = update.Text
                    };
                }
            }

            var aiContent = fullResponse.ToString();

            if (string.IsNullOrWhiteSpace(aiContent))
                throw new InvalidOperationException(
                    "AI returned an empty response.");

            var aiMessage = new AIChatMessages
            {
                AIChatSessionId = session.AIChatSessionId,
                SenderType = SenderType.AI,
                Content = aiContent,
                CreatedAt = DateTime.UtcNow
            };

            _repository.AddMessage(aiMessage);
        }

        private (AIChatSessions Session, List<ChatMessage> Messages)
            PrepareConversation(int userId, SendAIMessageDTO dto)
        {
            if (userId <= 0)
                throw new ArgumentException("Invalid user ID.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Content))
                throw new ArgumentException("Message content is required.");

            AIChatSessions session;

            if (dto.AIChatSessionId.HasValue)
            {
                session = _repository.GetSessionById(
                    dto.AIChatSessionId.Value, userId)
                    ?? throw new NotFoundException("Chat session not found.");

                if (session.ClosedAt.HasValue)
                    throw new ConflictException("Chat session is closed.");
            }
            else
            {
                session = new AIChatSessions
                {
                    UserId = userId,
                    MainEventId = dto.MainEventId,
                    CreatedAt = DateTime.UtcNow
                };

                session = _repository.CreateSession(session);
            }

            var userMessage = new AIChatMessages
            {
                AIChatSessionId = session.AIChatSessionId,
                SenderType = SenderType.User,
                Content = dto.Content.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _repository.AddMessage(userMessage);

            var history = _repository.GetMessagesBySession(
                session.AIChatSessionId);

            var chatMessages = history.Select(message =>
                new ChatMessage(
                    message.SenderType == SenderType.User
                        ? ChatRole.User
                        : ChatRole.Assistant,
                    message.Content))
                .ToList();

            return (session, chatMessages);
        }
    }
}
