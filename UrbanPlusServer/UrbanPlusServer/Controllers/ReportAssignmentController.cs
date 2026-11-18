
using BLL.Services.ServicesDB.ReportAssignmentServices;
using DTO.ReportAssignmentDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class ReportAssignmentController : ControllerBase
    {
        private readonly IReportAssignmentService _reportAssignmentService;

        public ReportAssignmentController(
            IReportAssignmentService reportAssignmentService)
        {
            _reportAssignmentService = reportAssignmentService;
        }

        // GET: api/ReportAssignment
        [HttpGet]
        public ActionResult<List<ShowReportAssignmentDTO>> GetAllAssignments()
        {
            var assignments =
                _reportAssignmentService.GetAllAssignments();

            return Ok(assignments);
        }

        // GET: api/ReportAssignment/Report/5/Current
        [HttpGet("Report/{reportId}/Current")]
        public ActionResult<ShowReportAssignmentDTO>
            GetCurrentAssignmentByReportId(int reportId)
        {
            var assignment =
                _reportAssignmentService.GetCurrentAssignmentByReportId(
                    reportId);

            return Ok(assignment);
        }

        // GET: api/ReportAssignment/Report/5/History
        [HttpGet("Report/{reportId}/History")]
        public ActionResult<List<ShowReportAssignmentDTO>>
            GetAssignmentHistoryByReportId(int reportId)
        {
            var history =
                _reportAssignmentService.GetAssignmentHistoryByReportId(
                    reportId);

            return Ok(history);
        }

        // POST: api/ReportAssignment
        [HttpPost]
        public ActionResult<ShowReportAssignmentDTO> AssignProvider(
            [FromBody] CreateReportAssignmentDTO dto)
        {
            // שליפת מזהה המנהל מתוך ה-JWT
            var managerIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(managerIdClaim, out int managerId))
                return Unauthorized();

            var assignment =
                _reportAssignmentService.AssignProvider(
                    dto, managerId);

            return CreatedAtAction(
                nameof(GetCurrentAssignmentByReportId),
                new { reportId = dto.ReportId },
                assignment);
        }
    }
}
