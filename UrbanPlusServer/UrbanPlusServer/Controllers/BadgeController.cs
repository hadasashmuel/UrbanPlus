
using BLL.Services.ServicesDB.BadgeServices;
using DTO.BadgeDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class BadgeController : ControllerBase
    {
        private readonly IBadgeService _badgeService;

        public BadgeController(IBadgeService badgeService)
        {
            _badgeService = badgeService;
        }

        // GET: api/Badge
        [HttpGet]
        public ActionResult<List<ShowBadgeDTO>> GetAllBadges()
        {
            var badges = _badgeService.GetAllBadges();

            return Ok(badges);
        }

        // GET: api/Badge/5
        [HttpGet("{id}")]
        public ActionResult<ShowBadgeDTO> GetBadgeById(int id)
        {
            var badge = _badgeService.GetBadgeById(id);

            return Ok(badge);
        }

        // POST: api/Badge
        [HttpPost]
        public ActionResult<ShowBadgeDTO> CreateBadge( [FromBody] CreateBadgeDTO dto)
        {
            var createdBadge = _badgeService.CreateBadge(dto);

            return CreatedAtAction(
                nameof(GetBadgeById),
                new { id = createdBadge.BadgeId },
                createdBadge);
        }

        // DELETE: api/Badge/5
        [HttpDelete("{id}")]
        public IActionResult DeleteBadge(int id)
        {
            _badgeService.DeleteBadge(id);

            return NoContent();
        }
    }
}
