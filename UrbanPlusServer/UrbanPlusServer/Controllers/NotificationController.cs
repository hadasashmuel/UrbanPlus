
using BLL.Services.ServicesDB.NotificationServices;
using DTO.NotificationDTO;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(
            INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // GET: api/Notification
        [HttpGet]
        public ActionResult<List<ShowNotificationDTO>>GetAllNotifications()
        {
            var notifications =_notificationService.GetAllNotifications();

            return Ok(notifications);
        }

        // GET: api/Notification/user/5
        [HttpGet("user/{userId}")]
        public ActionResult<List<ShowNotificationDTO>>GetNotificationsByUserId(int userId)
        {
            var notifications =_notificationService.GetNotificationsByUserId(userId);

            return Ok(notifications);
        }

        // GET: api/Notification/user/5/unread
        [HttpGet("user/{userId}/unread")]
        public ActionResult<List<ShowNotificationDTO>>GetUnreadNotificationsByUserId(int userId)
        {
            var notifications = _notificationService.GetUnreadNotificationsByUserId(userId);

            return Ok(notifications);
        }

        // PUT: api/Notification/10/read/5
        [HttpPut("{id}/read/{userId}")]
        public IActionResult MarkNotificationAsRead(int id, int userId)
        {
            var updated =
                _notificationService.MarkNotificationAsRead(
                    id, userId);

            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/Notification/10/user/5
        [HttpDelete("{id}/user/{userId}")]
        public IActionResult DeleteNotification(int id, int userId)
        {
            var deleted =_notificationService.DeleteNotification(id, userId);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
