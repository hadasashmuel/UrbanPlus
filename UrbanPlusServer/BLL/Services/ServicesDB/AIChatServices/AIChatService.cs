
using BLL.Exceptions;
using BLL.Services.ServicesDB.AIChatServices.Tools;
using DAL.Entities;
using DAL.Repositories.AIChatRepositories;
using DTO.AIChatMessagesDTO;
using Microsoft.Extensions.AI;
using System.ClientModel;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Text;

namespace BLL.Services.ServicesDB.AIChatServices
{
    public class AIChatService : IAIChatService
    {
        private readonly IAIChatRepository _repository;
        private readonly IChatClient _chatClient;
        private readonly AIChatTools _aiChatTools;

        public AIChatService(
            IAIChatRepository repository,
            IChatClient chatClient,
            AIChatTools aiChatTools)
        {
            _repository = repository;
            _chatClient = chatClient;
            _aiChatTools = aiChatTools;
        }

        private ChatOptions CreateChatOptions()
        {
            Console.WriteLine("CREATING CHAT OPTIONS");

            return new ChatOptions
            {
                Instructions = """
        אתה העוזר החכם של מערכת UrbanPlus.

        המערכת עוסקת בדיווח, איתור ומעקב אחר מפגעים עירוניים
        במרחב הציבורי.

        סוגי המידע במערכת עשויים לכלול:
        - מפגעי כבישים ותשתיות.
        - מפגעי תאורה.
        - מפגעי ניקיון.
        - מפגעים במדרכות ובמרחב הציבורי.
        - מפגעים עירוניים נוספים.

        כללי התנהגות:
        1. ענה תמיד בעברית ברורה, נעימה ומקצועית.
        2. התייחס למידע שהתקבל מהכלים בלבד.
        3. אל תמציא פרטים שלא קיימים במערכת.
        4. לעולם אל תציג מזהים פנימיים למשתמש.
           לדוגמה: MainEventsId, CategoryId או מזהים מספריים.
        5. לעולם אל תציג JSON גולמי או שמות שדות טכניים.
        6. השתמש במידע שהתקבל מהכלים כדי לנסח תשובות טבעיות.
        7. אם המשתמש מבקש מידע על מפגע מסוים, הצג את פרטיו.
        8. אם המשתמש מבקש מפגעים באזור מסוים, השתמש בכלי החיפוש.
        9. אם המשתמש מבקש מפגעים פתוחים, השתמש בפרמטר onlyOpen=true.
        10. אם המשתמש מבקש מידע על קטגוריות, השתמש בכלי הקטגוריות.
        11. אם לא נמצאו תוצאות, אמור זאת בצורה נעימה.
        12. אל תציג קואורדינטות GPS גולמיות אלא אם המשתמש מבקש אותן.
        13. אל תטען שמפגע טופל או נסגר אלא אם הסטטוס במערכת מאשר זאת.

        עיצוב התשובות:

        כאשר מציגים מפגע, השתמש במבנה הבא ככל שהמידע זמין:

        🚧 **שם המפגע**

        📍 **מיקום:** כתובת המפגע

        📝 **תיאור:** תיאור המפגע, אם קיים

        ⚠️ **חומרה:** רמת החומרה

        🔄 **סטטוס:** מצב הטיפול במפגע

        ⏱️ **זמן טיפול משוער:** זמן הטיפול המשוער, אם קיים

        📅 **תאריך דיווח:** מועד יצירת הדיווח

        כאשר מציגים מספר מפגעים:
        - הצג כל מפגע בנפרד.
        - הפרד בין המפגעים באמצעות כותרות ורווחים.
        - אל תציג מזהים פנימיים.
        - שמור על תשובה קצרה ונוחה לקריאה.

        זכור:
        המטרה שלך היא לעזור לתושבים להבין אילו מפגעים קיימים,
        היכן הם נמצאים ומה מצב הטיפול בהם.
        """,

                Tools =
                [
                    AIFunctionFactory.Create(
                (Func<List<object>>)_aiChatTools.GetAllMainEvents),

            AIFunctionFactory.Create(
                (Func<int, object?>)_aiChatTools.GetMainEventById),

            AIFunctionFactory.Create(
                (Func<List<object>>)_aiChatTools.GetAllCategories),

            AIFunctionFactory.Create(
                (Func<string?, string?, bool, List<object>>)
                _aiChatTools.SearchMainEvents)
                ]
            };
        }

        public async Task<AIChatMessageResponseDTO> SendMessage(
            int userId,
            SendAIMessageDTO dto)
        {
            var (session, chatMessages) =
                PrepareConversation(userId, dto);

            string aiContent;

            try
            {
                Console.WriteLine("GEMINI REQUEST START");

                var timer = Stopwatch.StartNew();

                var response = await _chatClient.GetResponseAsync(
                    chatMessages,
                    CreateChatOptions());

                Console.WriteLine(
                    $"GEMINI RESPONSE RECEIVED: {timer.ElapsedMilliseconds} ms");

                aiContent = response.Text;
            }
            catch (ClientResultException ex)
            {
                LogGeminiError(ex);

                return new AIChatMessageResponseDTO
                {
                    AIChatSessionId = session.AIChatSessionId,
                    SenderType = SenderType.AI,
                    Content = "שירות ה-AI נתקל כרגע בבעיה. נסי שוב בעוד כמה דקות.",
                    CreatedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("GEMINI GENERAL ERROR:");
                Console.WriteLine(ex.ToString());
                throw;
            }

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
                AIChatSessionId = session.AIChatSessionId,
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
            var timer = Stopwatch.StartNew();

            Console.WriteLine("STEP 1 - STREAM START");
            Console.WriteLine("STEP 2 - BEFORE PREPARE");

            var (session, chatMessages) =
                PrepareConversation(userId, dto);

            Console.WriteLine("STEP 3 - AFTER PREPARE");

            Console.WriteLine(
                $"PREPARE FINISHED: {timer.ElapsedMilliseconds} ms");

            Console.WriteLine(
                $"MESSAGES COUNT: {chatMessages.Count}");

            var fullResponse = new StringBuilder();

            Console.WriteLine("GEMINI STREAM START");

            IAsyncEnumerable<ChatResponseUpdate> stream;
            IAsyncEnumerator<ChatResponseUpdate> enumerator;

            // אתחול הזרם
            try
            {
                Console.WriteLine("BEFORE CREATE OPTIONS");

                var options = CreateChatOptions();

                Console.WriteLine("AFTER CREATE OPTIONS");
                Console.WriteLine("BEFORE GET STREAMING RESPONSE");

                stream = _chatClient.GetStreamingResponseAsync(
                    chatMessages,
                    options,
                    cancellationToken);

                Console.WriteLine("AFTER GET STREAMING RESPONSE");
                Console.WriteLine("BEFORE GET ASYNC ENUMERATOR");

                enumerator = stream.GetAsyncEnumerator(
                    cancellationToken);

                Console.WriteLine("AFTER GET ASYNC ENUMERATOR");
            }
            catch (ClientResultException ex)
            {
                LogGeminiError(ex);
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine("STREAM INITIALIZATION ERROR:");
                Console.WriteLine(ex.ToString());
                throw;
            }

            try
            {
                await using (enumerator)
                {
                    while (true)
                    {
                        bool hasNext;

                        try
                        {
                            Console.WriteLine("BEFORE MOVENEXT");

                            hasNext = await enumerator.MoveNextAsync();

                            Console.WriteLine(
                                $"AFTER MOVENEXT: {hasNext}");
                        }
                        catch (ClientResultException ex)
                        {
                            LogGeminiError(ex);
                            throw;
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("GENERAL STREAM ERROR:");
                            Console.WriteLine(ex.ToString());
                            throw;
                        }

                        if (!hasNext)
                            break;

                        var update = enumerator.Current;

                        if (string.IsNullOrEmpty(update.Text))
                            continue;

                        Console.WriteLine(
                            $"GEMINI UPDATE RECEIVED: {timer.ElapsedMilliseconds} ms");

                        fullResponse.Append(update.Text);

                        yield return new AIChatStreamChunkDTO
                        {
                            AIChatSessionId = session.AIChatSessionId,
                            Content = update.Text
                        };
                    }
                }
            }
            finally
            {
                Console.WriteLine(
                    $"GEMINI STREAM EXIT: {timer.ElapsedMilliseconds} ms");
            }

            Console.WriteLine("GEMINI STREAM FINISHED");

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

            Console.WriteLine(
                $"AI MESSAGE SAVED: {timer.ElapsedMilliseconds} ms");

            Console.WriteLine("STREAM MESSAGE COMPLETED");
        }

        private void LogGeminiError(ClientResultException ex)
        {
            Console.WriteLine(
                "========== GEMINI API ERROR ==========");

            Console.WriteLine($"STATUS: {ex.Status}");
            Console.WriteLine($"MESSAGE: {ex.Message}");

            try
            {
                var rawResponse = ex.GetRawResponse();

                if (rawResponse != null)
                {
                    Console.WriteLine(
                        "========== GEMINI ERROR BODY ==========");

                    Console.WriteLine(
                        rawResponse.Content.ToString());
                }
            }
            catch (Exception loggingException)
            {
                Console.WriteLine(
                    "COULD NOT READ ERROR BODY:");

                Console.WriteLine(loggingException.ToString());
            }

            Console.WriteLine(
                "========== FULL EXCEPTION ==========");

            Console.WriteLine(ex.ToString());
        }

        private (AIChatSessions Session, List<ChatMessage> Messages)
            PrepareConversation(int userId, SendAIMessageDTO dto)
        {
            Console.WriteLine("PREPARE A - START");

            if (userId <= 0)
                throw new ArgumentException("Invalid user ID.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Content))
                throw new ArgumentException(
                    "Message content is required.");

            AIChatSessions session;

            if (dto.AIChatSessionId.HasValue)
            {
                Console.WriteLine(
                    "PREPARE B - BEFORE GET SESSION");

                session = _repository.GetSessionById(
                    dto.AIChatSessionId.Value,
                    userId)
                    ?? throw new NotFoundException(
                        "Chat session not found.");

                Console.WriteLine(
                    "PREPARE C - AFTER GET SESSION");

                if (session.ClosedAt.HasValue)
                    throw new ConflictException(
                        "Chat session is closed.");
            }
            else
            {
                Console.WriteLine(
                    "PREPARE B - BEFORE CREATE SESSION");

                session = new AIChatSessions
                {
                    UserId = userId,
                    MainEventId = dto.MainEventId,
                    CreatedAt = DateTime.UtcNow
                };

                session = _repository.CreateSession(session);

                Console.WriteLine(
                    "PREPARE C - AFTER CREATE SESSION");
            }

            var userMessage = new AIChatMessages
            {
                AIChatSessionId = session.AIChatSessionId,
                SenderType = SenderType.User,
                Content = dto.Content.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            Console.WriteLine(
                "PREPARE D - BEFORE ADD MESSAGE");

            _repository.AddMessage(userMessage);

            Console.WriteLine(
                "PREPARE E - AFTER ADD MESSAGE");

            Console.WriteLine(
                "PREPARE F - BEFORE GET HISTORY");

            var history = _repository.GetMessagesBySession(
                session.AIChatSessionId);

            Console.WriteLine(
                "PREPARE G - AFTER GET HISTORY");

            var chatMessages = history.Select(message =>
                new ChatMessage(
                    message.SenderType == SenderType.User
                        ? ChatRole.User
                        : ChatRole.Assistant,
                    message.Content))
                .ToList();

            Console.WriteLine(
                "PREPARE H - MESSAGES CREATED");

            return (session, chatMessages);
        }
    }
}
