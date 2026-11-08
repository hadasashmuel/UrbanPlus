
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

        // GET: api/SaveEvent/mine
        [HttpGet("mine")]
        public ActionResult<List<ShowSavedEventsDTO>> GetMine()
        {
            return Ok(_saveEventService.GetSavedEventsByUserId(User.GetUserId()));
        }

        // GET: api/SaveEvent/5
        [HttpGet("{id:int}")]
        public ActionResult<ShowSavedEventsDTO> GetSavedEventById(int id)
        {
            int userId = User.GetUserId();

            var savedEvent = _saveEventService.GetSavedEventById(id, userId);

            return Ok(savedEvent);
        }

        // POST: api/SaveEvent
        [HttpPost]
        public ActionResult<ShowSavedEventsDTO> CreateSavedEvent(
            [FromBody] CreateSaveEventDTO dto)
        {
            int userId = User.GetUserId();

            var createdSavedEvent = _saveEventService.CreateSavedEvent(dto, userId);

            return CreatedAtAction(
                nameof(GetSavedEventById),
                new { id = createdSavedEvent.SavedEventId },
                createdSavedEvent);
        }

        // DELETE: api/SaveEvent/5
        [HttpDelete("{id:int}")]
        public IActionResult DeleteSavedEvent(int id)
        {
            int userId = User.GetUserId();

            _saveEventService.DeleteSavedEvent(id, userId);

            return NoContent();
        }
    }
}
