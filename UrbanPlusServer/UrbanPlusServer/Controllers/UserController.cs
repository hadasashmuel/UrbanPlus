
using BLL.Exceptions;
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

        // ====================
        // Register
        // ====================

        // POST: api/User/register
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult CreateUser([FromForm] CreateUserDTO dto)
        {
            _userService.CreateUser(dto);

            return Ok("User created successfully.");
        }

        // ====================
        // Login
        // ====================

        // POST: api/User/login
        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<AuthResponseUserDto> Login(
            [FromBody] LoginUserDTO dto)
        {
            var result = _userService.Login(dto);

            if (result == null)
                return Unauthorized("Wrong email or password.");

            return Ok(result);
        }

        // POST: api/User/google-login
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<ActionResult<AuthResponseUserDto>> GoogleLogin(
            [FromBody] GoogleLoginDTO dto)
        {
            var result = await _userService.GoogleLogin(dto);

            if (result == null)
                return Unauthorized("Google authentication failed.");

            return Ok(result);
        }

        // ====================
        // User Profile
        // ====================

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
        public ActionResult<ShortProfileUserDTO> GetShortUserById(
            int userId)
        {
            var user = _userService.GetShortUserById(userId);

            return Ok(user);
        }

        // PUT: api/User
        [HttpPut]
        public ActionResult<ProfileUserDTO> UpdateUser(
            [FromForm] UpdateUserDTO dto)
        {
            var updatedUser = _userService.UpdateUser(
                User.GetUserId(), dto);

            return Ok(updatedUser);
        }

        // Admin - Get All Users


        // GET: api/User/admin/all
        [Authorize(Roles = "1")]
        [HttpGet("admin/all")]
        public ActionResult<List<AdminUserDTO>> GetAllUsers()
        {
            var users = _userService.GetAllUsers();

            return Ok(users);
        }

        // Admin - Delete User


        // DELETE: api/User/admin/5
        [Authorize(Roles = "1")]
        [HttpDelete("admin/{userId}")]
        public IActionResult DeleteUser(
            int userId,
            [FromBody] DeleteUserDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Reason))
                return BadRequest("Deletion reason is required.");

            try
            {
                var deleted = _userService.DeleteUser(
                    userId, dto.Reason);

                if (!deleted)
                    return NotFound("User could not be deleted.");

                return Ok("User deleted successfully.");
            }
            catch (NotFoundException)
            {
                return NotFound("User was already deleted or does not exist.");
            }
        }
    }
}
