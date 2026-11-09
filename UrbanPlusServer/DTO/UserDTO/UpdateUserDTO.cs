
using DTO.Validation;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTO.UserDTO
{
    public class UpdateUserDTO
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "First name cannot contain only spaces")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Last name cannot contain only spaces")]
        public string LastName { get; set; }
        [AllowedExtensions(".jpg", ".jpeg", ".png", ".webp")]
        public IFormFile? ProfilePicture { get; set; }
    }
}
