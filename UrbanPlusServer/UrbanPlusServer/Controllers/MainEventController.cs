
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
        // PUT: api/MainEvent/admin/5

        [Authorize(Roles = "1")]
        [HttpPut("admin/{id:int}")]
        public async Task<IActionResult> UpdateMainEvent(
            int id,
            [FromBody] UpdateMainEventDTO dto)
        {
            var result = await _mainEventService.UpdateMainEvent(id, dto);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/MainEvent/admin/5
        [Authorize(Roles = "1")]
        [HttpDelete("admin/{id:int}")]
        public IActionResult DeleteMainEvent(  int id,[FromBody] DeleteMainEventDTO dto)
        {
            var result = _mainEventService.DeleteMainEvent(
                id,
                dto.Reason);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
