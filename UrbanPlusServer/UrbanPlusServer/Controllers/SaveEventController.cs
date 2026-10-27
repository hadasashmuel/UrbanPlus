using BLL.Services.ServicesDB.SaveEventServices;
using DTO.SaveEventDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SaveEventController : ControllerBase
    {
        private readonly ISaveEventService _saveEventService;

        public SaveEventController(ISaveEventService saveEventService)
        {
            _saveEventService = saveEventService;
        }

        [HttpGet]
        public ActionResult<List<ShowSavedEventsDTO>> GetSavedEventsByUserId()
        {
            int userId = User.GetUserId();

            return Ok(_saveEventService.GetSavedEventsByUserId(userId));
        }

        [HttpGet("{id:int}")]
        public ActionResult<ShowSavedEventsDTO> GetSavedEventById(int id)
        {
            if (id <= 0)
                return BadRequest();

            int userId = User.GetUserId();

            var savedEvent = _saveEventService.GetSavedEventById(id, userId);

            if (savedEvent == null)
                return NotFound();

            return Ok(savedEvent);
        }
        [HttpGet("mine")]
        public ActionResult<List<ShowSavedEventsDTO>> GetMine()
        {
            return Ok(
                _saveEventService.GetSavedEventsByUserId(User.GetUserId()));
        }
        [HttpPost]
        public ActionResult<ShowSavedEventsDTO> CreateSavedEvent( [FromBody] CreateSaveEventDTO dto)
        {
            int userId = User.GetUserId();

            var createdSavedEvent =
                _saveEventService.CreateSavedEvent(dto, userId);

            return CreatedAtAction(
                nameof(GetSavedEventById),
                new { id = createdSavedEvent.SavedEventId },
                createdSavedEvent);
        }
        [HttpDelete("{id:int}")]
        public IActionResult DeleteSavedEvent(int id)
        {
            if (id <= 0)
                return BadRequest();

            int userId = User.GetUserId();

            var deleted = _saveEventService.DeleteSavedEvent(id, userId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

    }
}
