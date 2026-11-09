
using BLL.Services.ServicesDB.UserServices;
using DTO.UserDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/User/register
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult CreateUser([FromForm] CreateUserDTO dto)
        {
            _userService.CreateUser(dto);

            return Ok("User created successfully.");
        }

        // POST: api/User/login
        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<AuthResponseUserDto> Login( [FromBody] LoginUserDTO dto)
        {
            var result = _userService.Login(dto);

            if (result == null)
                return Unauthorized("Wrong email or password.");

            return Ok(result);
        }

        // GET: api/User/me
        [HttpGet("me")]
        public ActionResult<ProfileUserDTO> GetMyProfile()
        {
            var user = _userService.GetUserById(User.GetUserId());

            return Ok(user);
        }

        // GET: api/User/5/short
        [AllowAnonymous]
        [HttpGet("{userId}/short")]
        public ActionResult<ShortProfileUserDTO> GetShortUserById(int userId)
        {
            var user = _userService.GetShortUserById(userId);

            return Ok(user);
        }

        // PUT: api/User
        [HttpPut]
        public ActionResult<ProfileUserDTO> UpdateUser([FromForm] UpdateUserDTO dto)
        {
            var updatedUser = _userService.UpdateUser(User.GetUserId(), dto);

            return Ok(updatedUser);
        }

        // DELETE: api/User/5
        [Authorize(Roles = "1")]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            _userService.DeleteUser(userId);

            return NoContent();
        }
    }
}
