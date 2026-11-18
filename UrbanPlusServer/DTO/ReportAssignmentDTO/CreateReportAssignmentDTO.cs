using System.ComponentModel.DataAnnotations;

namespace DTO.ReportAssignmentDTO
{
    public class CreateReportAssignmentDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ReportId must be greater than 0")]
        public int ReportId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ProviderId must be greater than 0")]
        public int ProviderId { get; set; }
    }
}