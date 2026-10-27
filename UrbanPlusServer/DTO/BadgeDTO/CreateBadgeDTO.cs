using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.BadgeDTO
{
    public class CreateBadgeDTO
    {
        [Required]
        public string BadgeName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public IFormFile? IconUrl { get; set; }
    }
}
