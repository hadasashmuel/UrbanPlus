using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.ReportImageDTO
{
    public class CreateReportImageDTO
    {
        [Required]
        public int ReportId { get; set; }

        [Required]
        [MaxLength(2048)]
        public IFormFile ImageUrl { get; set; } 
    }
}
