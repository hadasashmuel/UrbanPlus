
using BLL.Services.ServicesDB.MessageServices;
using DAL.Entities;
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

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
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

            if (message == null)
                return NotFound();

            return Ok(message);
        }

        // POST: api/Message
        [HttpPost]
        public ActionResult<ShowMessageDTO> CreateMessage( [FromBody] CreateMessageDTO dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized();

            var createdMessage =  _messageService.CreateMessage(dto, userId);

            return CreatedAtAction(
                nameof(GetMessageById),
                new { id = createdMessage.MessageId },
                createdMessage);
        }

        // DELETE: api/Message/5
        [HttpDelete("{id}")]
        public IActionResult DeleteMessage(int id)
        {
            var deleted = _messageService.DeleteMessage( id, User.GetUserId());

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
