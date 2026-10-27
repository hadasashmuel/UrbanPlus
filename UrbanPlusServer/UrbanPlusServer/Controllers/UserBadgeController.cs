using BLL.Services.ServicesDB.UserBadgeServices;
using DTO.BadgeDTO;
using DTO.UserBadgeDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserBadgeController : ControllerBase
    {
        private readonly IUserBadgeService _userBadgeService;

        public UserBadgeController(IUserBadgeService userBadgeService)
        {
            _userBadgeService = userBadgeService;
        }
        [HttpGet("mine")]
        public ActionResult<List<ShowBadgeDTO>> GetMine()
        {
            return Ok(_userBadgeService.GetMine(User.GetUserId()));
        }

        [HttpGet]
        public ActionResult<List<ShowUserBadgeDTO>> GetBadgesByUserId()
        {
            int userId = User.GetUserId();

            try
            {
                return Ok(_userBadgeService.GetBadgesByUserId(userId));
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "User not found." });
            }
        }

        // GET: api/UserBadge/10
        [HttpGet("{id:int}")]
        public ActionResult<ShowUserBadgeDTO> GetUserBadgeById(int id)
        {
            var userBadge = _userBadgeService.GetUserBadgeById(id);

            if (userBadge == null)
                return NotFound();

            return Ok(userBadge);
        }

        // POST: api/UserBadge/award?userId=5&badgeId=2
        [Authorize(Roles = "1")]
        [HttpPost("award")]
        public ActionResult<ShowUserBadgeDTO> AwardBadgeToUser([FromQuery] int userId,[FromQuery] int badgeId)
        {
            if (userId <= 0 || badgeId <= 0)
                return BadRequest();

            try
            {
                var result = _userBadgeService.AwardBadgeToUser(userId, badgeId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // DELETE: api/UserBadge/10
        [Authorize(Roles = "1")]
        [HttpDelete("{id:int}")]
        public IActionResult DeleteUserBadge(int id)
        {
            var deleted = _userBadgeService.DeleteUserBadge(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
