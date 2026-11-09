
using DTO.Validation;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.BadgeDTO
{
    public class CreateBadgeDTO
    {
        [Required(ErrorMessage = "Badge name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Badge name must be between 2 and 50 characters")]
        public string BadgeName { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250, MinimumLength = 2, ErrorMessage = "Description must be between 2 and 250 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Badge icon is required")]
        [AllowedExtensions(".jpg", ".jpeg", ".png", ".webp")]
        public IFormFile? IconUrl { get; set; }
    }
}
