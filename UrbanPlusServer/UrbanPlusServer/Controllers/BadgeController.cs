
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
        public ActionResult<ShowBadgeDTO> CreateBadge(
            [FromForm] CreateBadgeDTO dto)
        {
            var createdBadge = _badgeService.CreateBadge(dto);

            return CreatedAtAction(
                nameof(GetBadgeById),
                new { id = createdBadge.BadgeId },
                createdBadge);
        }

        // PUT: api/Badge/5
        [HttpPut("{id}")]
        public ActionResult<ShowBadgeDTO> UpdateBadge(
            int id,
            [FromForm] UpdateBadgeDTO dto)
        {
            var updatedBadge = _badgeService.UpdateBadge(id, dto);

            return Ok(updatedBadge);
        }

        // DELETE: api/Badge/5
        [HttpDelete("{id}")]
        public IActionResult DeleteBadge(int id)
        {
            var deleted = _badgeService.DeleteBadge(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
