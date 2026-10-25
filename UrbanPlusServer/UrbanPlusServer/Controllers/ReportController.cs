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
            try
            {
                var reports = _reportService.GetAllReports();

                return Ok(reports);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while retrieving reports.");
            }
        }

        // GET: api/Report/5
        [HttpGet("{id}")]
        public ActionResult<ShowReportDTO> GetReportById(int id)
        {
            try
            {
                var report = _reportService.GetReportById(id);

                if (report == null)
                    return NotFound();

                return Ok(report);
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while retrieving the report.");
            }
        }

        // POST: api/Report?userId=5
        [HttpPost]
        public ActionResult<ShowReportDTO> CreateReport(
            [FromForm] CreateReportDTO dto,
            [FromQuery] int userId)
        {
            try
            {
                var createdReport = _reportService.CreateReport(dto, userId);

                return CreatedAtAction(
                    nameof(GetReportById),
                    new { id = createdReport.ReportId },
                    createdReport);
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
                return StatusCode(500, "An unexpected error occurred while creating the report.");
            }
        }

        // DELETE: api/Report/5
        [HttpDelete("{id}")]
        public IActionResult DeleteReport(int id)
        {
            try
            {
                var deleted = _reportService.DeleteReport(id);

                if (!deleted)
                    return NotFound();

                return NoContent();
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while deleting the report.");
            }
        }
    }
}