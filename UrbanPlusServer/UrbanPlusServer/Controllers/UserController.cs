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
            try
            {
                var created = _userService.CreateUser(dto);

                if (!created)
                    return Conflict("A user with this email already exists.");

                return Ok("User created successfully.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode( 500, "An unexpected error occurred while creating the user.");
            }
        }

        // POST: api/User/login
        [AllowAnonymous]
        [HttpPost("login")]
        public ActionResult<AuthResponseUserDto> Login([FromBody] LoginUserDTO dto)
        {
            try
            {
                var result = _userService.Login(dto);

                if (result is null)
                    return Unauthorized("Wrong email or password.");

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while logging in.");
            }
        }

        // GET: api/User/5
        [HttpGet("{userId}")]
        public ActionResult<ProfileUserDTO> GetMyProfile()
        {
            var user = _userService.GetUserById(User.GetUserId());

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // GET: api/User/5/short
        [AllowAnonymous]
        [HttpGet("{userId}/short")]
        public ActionResult<ShortProfileUserDTO> GetShortUserById(int userId)
        {
            try
            {
                var user = _userService.GetShortUserById(userId);

                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception)
            {
                return StatusCode(500,"An unexpected error occurred while retrieving the user.");
            }
        }

        // PUT: api/User/5
        [HttpPut]
        public ActionResult<ProfileUserDTO> UpdateUser( [FromForm] UpdateUserDTO dto)
        {
            var updatedUser = _userService.UpdateUser(  User.GetUserId(), dto);

            if (updatedUser == null)
                return NotFound();

            return Ok(updatedUser);
        }

        // DELETE: api/User/5
        [Authorize(Roles = "1")]
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser()
        {
            var deleted = _userService.DeleteUser(User.GetUserId());

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}