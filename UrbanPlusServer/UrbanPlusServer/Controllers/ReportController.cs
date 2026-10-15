
using BLL.Services.ServicesDB.ReportServices;
using DTO.ReportDTO;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // GET: api/Report
        [HttpGet]
        public ActionResult<List<ShowReportDTO>> GetAllReports()
        {
            var reports = _reportService.GetAllReports();

            return Ok(reports);
        }

        // GET: api/Report/5
        [HttpGet("{id}")]
        public ActionResult<ShowReportDTO> GetReportById(int id)
        {
            var report = _reportService.GetReportById(id);

            if (report == null)
                return NotFound();

            return Ok(report);
        }

        // POST: api/Report?userId=5
        [HttpPost]
        public ActionResult<ShowReportDTO> CreateReport( [FromBody] CreateReportDTO dto,[FromQuery] int userId)
        {
            var createdReport =_reportService.CreateReport(dto, userId);

            return CreatedAtAction(
                nameof(GetReportById),
                new { id = createdReport.ReportId },
                createdReport);
        }

        // DELETE: api/Report/5
        [HttpDelete("{id}")]
        public IActionResult DeleteReport(int id)
        {
            var deleted = _reportService.DeleteReport(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
