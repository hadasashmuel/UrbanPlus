
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.ReportImageDTO
{
    public class CreateReportImageDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ReportId must be greater than 0")]
        public int ReportId { get; set; }

        [Required(ErrorMessage = "Image is required")]
        public IFormFile ImageUrl { get; set; }
    }
}
