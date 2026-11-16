
using BLL.Services.ServicesDB.MessageServices;
using DTO.MessageDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using UrbanPlusServer.Hubs;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IHubContext<EventChatHub> _hubContext;

        public MessageController(
            IMessageService messageService,
            IHubContext<EventChatHub> hubContext)
        {
            _messageService = messageService;
            _hubContext = hubContext;
        }

        // GET: api/Message
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<ShowMessageDTO>> GetAllMessages()
        {
            var messages = _messageService.GetAllMessages();

            return Ok(messages);
        }

        // GET: api/Message/5
        [HttpGet("{id}")]
        public ActionResult<ShowMessageDTO> GetMessageById(int id)
        {
            var message = _messageService.GetMessageById(id);

            return Ok(message);
        }

        // POST: api/Message
        [HttpPost]
        public async Task<ActionResult<ShowMessageDTO>> CreateMessage(
            [FromBody] CreateMessageDTO dto)
        {
            int userId = User.GetUserId();

            // שמירת ההודעה במסד הנתונים
            var createdMessage = _messageService.CreateMessage(dto, userId);

            // שידור ההודעה לכל המשתמשים בקבוצת האירוע
            await _hubContext.Clients
                .Group($"event_{createdMessage.MainEventId}")
                .SendAsync("ReceiveMessage", createdMessage);

            return CreatedAtAction(
                nameof(GetMessageById),
                new { id = createdMessage.MessageId },
                createdMessage);
        }

        // GET: api/Message/event/5
        [HttpGet("event/{mainEventId}")]
        public ActionResult<List<ShowMessageDTO>> GetMessagesByEvent(
            int mainEventId)
        {
            var messages = _messageService.GetMessagesByEvent(mainEventId);

            return Ok(messages);
        }

        // DELETE: api/Message/5
        [HttpDelete("{id}")]
        public IActionResult DeleteMessage(int id)
        {
            _messageService.DeleteMessage(id, User.GetUserId());

            return NoContent();
        }
    }
}
