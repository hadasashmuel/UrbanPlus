
using BLL.Services.ServicesDB.MessageServices;
using BLL.Services.ServiceSupport.EventChatServices;
using DTO.MessageDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IEventChatNotifier _eventChatNotifier;

        public MessageController(
            IMessageService messageService,
            IEventChatNotifier eventChatNotifier)
        {
            _messageService = messageService;
            _eventChatNotifier = eventChatNotifier;
        }

        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<ShowMessageDTO>> GetAllMessages()
        {
            var messages = _messageService.GetAllMessages();
            return Ok(messages);
        }

        [HttpGet("{id}")]
        public ActionResult<ShowMessageDTO> GetMessageById(int id)
        {
            var message = _messageService.GetMessageById(id);
            return Ok(message);
        }

        [HttpPost]
        public async Task<ActionResult<ShowMessageDTO>> CreateMessage(
            [FromBody] CreateMessageDTO dto)
        {
            int userId = User.GetUserId();

            var createdMessage =
                _messageService.CreateMessage(dto, userId);

            await _eventChatNotifier.BroadcastMessageAsync(createdMessage);

            return CreatedAtAction(
                nameof(GetMessageById),
                new { id = createdMessage.MessageId },
                createdMessage);
        }

        [HttpGet("event/{mainEventId}")]
        public ActionResult<List<ShowMessageDTO>> GetMessagesByEvent(
            int mainEventId)
        {
            var messages = _messageService.GetMessagesByEvent(mainEventId);
            return Ok(messages);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMessage(int id)
        {
            _messageService.DeleteMessage(id, User.GetUserId());
            return NoContent();
        }
    }
}
