
using BLL.Services.ServicesDB.ReportServices;
using DTO.ReportDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // GET: api/Report
        [Authorize(Roles = "1")]
        [HttpGet]
        public ActionResult<List<ShowReportDTO>> GetAllReports()
        {
            var reports = _reportService.GetAllReports();

            return Ok(reports);
        }
        // GET: api/Report/MyReports
        [HttpGet("MyReports")]
        public ActionResult<List<ShowReportDTO>> GetMyReports()
        {
            int userId = User.GetUserId();

            var reports = _reportService.GetReportsByUser(userId);

            return Ok(reports);
        }
        // GET: api/Report/5
        [HttpGet("{id}")]
        public ActionResult<ShowReportDTO> GetReportById(int id)
        {
            var report = _reportService.GetReportById(id);

            return Ok(report);
        }

        // POST: api/Report
        [HttpPost]
        public ActionResult<ShowReportDTO> CreateReport( [FromForm] CreateReportDTO dto)
        {
            int userId = User.GetUserId();

            var createdReport = _reportService.CreateReport(dto, userId);

            return CreatedAtAction(
                nameof(GetReportById),
                new { id = createdReport.ReportId },
                createdReport);
        }

        // DELETE: api/Report/5
        [Authorize(Roles = "1")]
        [HttpDelete("{id}")]
        public IActionResult DeleteReport(int id)
        {
            _reportService.DeleteReport(id);

            return NoContent();
        }
    }
}
