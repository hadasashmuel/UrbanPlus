
using BLL.Services.ServicesDB.MainEventServices;
using DTO.MainEventDTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MainEventController : ControllerBase
    {
        private readonly IMainEventService _mainEventService;

        public MainEventController(IMainEventService mainEventService)
        {
            _mainEventService = mainEventService;
        }

        // GET: api/MainEvent
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<ShowMainEventDTO>> GetAllMainEvents()
        {
            return Ok(_mainEventService.GetAllMainEvents());
        }

        // GET: api/MainEvent/5
        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public ActionResult<ShowMainEventDTO> GetMainEventById(int id)
        {
            var mainEvent = _mainEventService.GetMainEventById(id);
            return Ok(mainEvent);
        }

        // DELETE: api/MainEvent/5
        [HttpDelete("{id:int}")]
        public IActionResult DeleteMainEvent(int id)
        {
            var result = _mainEventService.DeleteMainEvent(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
