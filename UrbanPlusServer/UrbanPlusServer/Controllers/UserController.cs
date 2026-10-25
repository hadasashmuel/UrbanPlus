using BLL.Services.ServicesDB.UserServices;
using DTO.UserDTO;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST: api/User
        [HttpPost]
        public ActionResult<ProfileUserDTO> CreateUser([FromForm] CreateUserDTO dto)
        {
            try
            {
                var createdUser = _userService.CreateUser(dto);

                return CreatedAtAction(
                    nameof(GetUserById),
                    new { userId = createdUser.UserId },
                    createdUser);
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
                return StatusCode(500, "An unexpected error occurred while creating the user.");
            }
        }

        // GET: api/User/5
        [HttpGet("{userId}")]
        public ActionResult<ProfileUserDTO> GetUserById(int userId)
        {
            try
            {
                var user = _userService.GetUserById(userId);

                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while retrieving the user.");
            }
        }

        // GET: api/User/5/short
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
                return StatusCode(500, "An unexpected error occurred while retrieving the user.");
            }
        }

        // PUT: api/User/5
        [HttpPut("{userId}")]
        public ActionResult<ProfileUserDTO> UpdateUser(
            int userId,
            [FromBody] UpdateUserDTO dto)
        {
            try
            {
                var updatedUser = _userService.UpdateUser(userId, dto);

                if (updatedUser == null)
                    return NotFound();

                return Ok(updatedUser);
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
                return StatusCode(500, "An unexpected error occurred while updating the user.");
            }
        }

        // DELETE: api/User/5
        [HttpDelete("{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            try
            {
                var deleted = _userService.DeleteUser(userId);

                if (!deleted)
                    return NotFound();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the user.");
            }
        }
    }
}