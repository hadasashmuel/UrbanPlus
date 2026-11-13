
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.ReportImageDTO
{
    public class CreateReportImageDTO
    {
        [Required(ErrorMessage = "Image is required")]
        public IFormFile ImageUrl { get; set; }
    }
}
