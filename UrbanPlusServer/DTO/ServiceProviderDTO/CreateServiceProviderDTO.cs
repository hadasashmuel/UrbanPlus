
using System.ComponentModel.DataAnnotations;

namespace DTO.ServiceProviderDTO
{
    public class CreateServiceProviderDTO
    {
        [Required(ErrorMessage = "Full name is required")]
        [StringLength(200, MinimumLength = 2)]
        [RegularExpression(@"^(?!\s*$).+",
            ErrorMessage = "Full name cannot contain only spaces")]
        public string FullName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Department { get; set; }

        [Phone(ErrorMessage = "Invalid phone number")]
        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(300)]
        public string? Email { get; set; }
    }
}
