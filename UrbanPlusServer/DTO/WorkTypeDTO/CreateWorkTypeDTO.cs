
using System.ComponentModel.DataAnnotations;

namespace DTO.WorkTypeDTO
{
    public class CreateWorkTypeDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Work type name is required")]
        [StringLength(200, MinimumLength = 2)]
        [RegularExpression(@"^(?!\s*$).+",
            ErrorMessage = "Work type name cannot contain only spaces")]
        public string NameWorkTypes { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }
}
