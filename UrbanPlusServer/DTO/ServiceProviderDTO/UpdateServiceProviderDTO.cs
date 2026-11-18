
using System.ComponentModel.DataAnnotations;

namespace DTO.ServiceProviderDTO
{
    public class UpdateServiceProviderDTO
    {
        [Required(ErrorMessage = "ProviderId is required")]
        [Range(1, int.MaxValue)]
        public int ProviderId { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        [StringLength(200, MinimumLength = 2)]
        [RegularExpression(@"^(?!\s*$).+")]
        public string FullName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Department { get; set; }

        [Phone]
        [StringLength(20)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(300)]
        public string? Email { get; set; }

        public bool IsActive { get; set; }
    }
}
