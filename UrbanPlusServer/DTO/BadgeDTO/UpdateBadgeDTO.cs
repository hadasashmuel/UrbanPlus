
using DTO.Validation;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.BadgeDTO
{
    public class UpdateBadgeDTO
    {
        [Required(ErrorMessage = "Badge name is required")]
        [StringLength(50, MinimumLength = 2)]
        public string BadgeName { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(200, MinimumLength = 2)]
        public string Description { get; set; }

        [AllowedExtensions(".jpg", ".jpeg", ".png", ".webp")]
        public IFormFile? IconUrl { get; set; }
    }
}
