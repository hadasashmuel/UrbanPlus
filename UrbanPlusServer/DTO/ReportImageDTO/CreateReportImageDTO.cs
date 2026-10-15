
using System.ComponentModel.DataAnnotations;

namespace DTO.ReportImageDTO
{
    public class CreateReportImageDTO
    {
        [Required]
        public int ReportId { get; set; }

        [Required]
        [MaxLength(2048)]
        public string ImageUrl { get; set; } = string.Empty;
    }
}
