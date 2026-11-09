
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

        // GET: api/UserBadge/mine
        [HttpGet("mine")]
        public ActionResult<List<ShowBadgeDTO>> GetMine()
        {
            return Ok(_userBadgeService.GetMine(User.GetUserId()));
        }

        // GET: api/UserBadge
        [HttpGet]
        public ActionResult<List<ShowUserBadgeDTO>> GetBadgesByUserId()
        {
            int userId = User.GetUserId();

            return Ok(_userBadgeService.GetBadgesByUserId(userId));
        }

        // GET: api/UserBadge/10
        [HttpGet("{id:int}")]
        public ActionResult<ShowUserBadgeDTO> GetUserBadgeById(int id)
        {
            var userBadge = _userBadgeService.GetUserBadgeById(id);

            return Ok(userBadge);
        }

        // POST: api/UserBadge/award?userId=5&badgeId=2
        [Authorize(Roles = "1")]
        [HttpPost("award")]
        public ActionResult<ShowUserBadgeDTO> AwardBadgeToUser( [FromQuery] int userId, [FromQuery] int badgeId)
        {
            var result = _userBadgeService.AwardBadgeToUser(userId, badgeId);

            return Ok(result);
        }

        // DELETE: api/UserBadge/10
        [Authorize(Roles = "1")]
        [HttpDelete("{id:int}")]
        public IActionResult DeleteUserBadge(int id)
        {
            _userBadgeService.DeleteUserBadge(id);

            return NoContent();
        }
    }
}
