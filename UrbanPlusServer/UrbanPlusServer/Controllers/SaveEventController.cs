using BLL.Services.ServicesDB.SaveEventServices;
using DTO.SaveEventDTO;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaveEventController : ControllerBase
    {
        private readonly ISaveEventService _saveEventService;

        public SaveEventController(
            ISaveEventService saveEventService)
        {
            _saveEventService = saveEventService;
        }

        // GET: api/SaveEvent/user/5
        [HttpGet("user/{userId:int}")]
        public ActionResult<List<ShowSavedEventsDTO>>
            GetSavedEventsByUserId(int userId)
        {
            if (userId <= 0)
                return BadRequest();

            return Ok(
                _saveEventService.GetSavedEventsByUserId(userId));
        }

        // GET: api/SaveEvent/12/user/5
        [HttpGet("{id:int}/user/{userId:int}")]
        public ActionResult<ShowSavedEventsDTO>
            GetSavedEventById(int id, int userId)
        {
            if (id <= 0 || userId <= 0)
                return BadRequest();

            var savedEvent =
                _saveEventService.GetSavedEventById(id, userId);

            if (savedEvent == null)
                return NotFound();

            return Ok(savedEvent);
        }

        // POST: api/SaveEvent?userId=5
        [HttpPost]
        public ActionResult<ShowSavedEventsDTO> CreateSavedEvent(
            [FromBody] CreateSaveEventDTO dto,
            [FromQuery] int userId)
        {
            if (userId <= 0)
                return BadRequest();

            var createdSavedEvent =
                _saveEventService.CreateSavedEvent(dto, userId);

            return CreatedAtAction(
                nameof(GetSavedEventById),
                new
                {
                    id = createdSavedEvent.SavedEventId,
                    userId = createdSavedEvent.UserId
                },
                createdSavedEvent);
        }

        // DELETE: api/SaveEvent/12/user/5
        [HttpDelete("{id:int}/user/{userId:int}")]
        public IActionResult DeleteSavedEvent(
            int id,
            int userId)
        {
            if (id <= 0 || userId <= 0)
                return BadRequest();

            var deleted =
                _saveEventService.DeleteSavedEvent(id, userId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
