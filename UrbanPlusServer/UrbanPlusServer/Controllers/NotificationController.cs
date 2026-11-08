
using BLL.Services.ServicesDB.NotificationServices;
using DTO.NotificationDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET: api/Notification
        [Authorize(Roles = "1")]
        [HttpGet]
        public ActionResult<List<ShowNotificationDTO>> GetAllNotifications()
        {
            var notifications = _notificationService.GetAllNotifications();

            return Ok(notifications);
        }

        // GET: api/Notification/mine
        [HttpGet("mine")]
        public ActionResult<List<ShowNotificationDTO>> GetMyNotifications()
        {
            int userId = User.GetUserId();

            var notifications =  _notificationService.GetNotificationsByUserId(userId);

            return Ok(notifications);
        }

        // GET: api/Notification/mine/unread
        [HttpGet("mine/unread")]
        public ActionResult<List<ShowNotificationDTO>> GetMyUnreadNotifications()
        {
            int userId = User.GetUserId();

            var notifications = _notificationService.GetUnreadNotificationsByUserId(userId);

            return Ok(notifications);
        }

        // PUT: api/Notification/10/read
        [HttpPut("{id}/read")]
        public IActionResult MarkNotificationAsRead(int id)
        {
            int userId = User.GetUserId();

            _notificationService.MarkNotificationAsRead(id, userId);

            return NoContent();
        }

        // DELETE: api/Notification/10
        [HttpDelete("{id}")]
        public IActionResult DeleteNotification(int id)
        {
            int userId = User.GetUserId();

            _notificationService.DeleteNotification(id, userId);

            return NoContent();
        }
    }
}
