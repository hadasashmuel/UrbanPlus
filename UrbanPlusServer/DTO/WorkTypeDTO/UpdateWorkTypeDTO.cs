
using System.ComponentModel.DataAnnotations;

namespace DTO.WorkTypeDTO
{
    public class UpdateWorkTypeDTO
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int WorkTypeId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Work type name is required")]
        [StringLength(200, MinimumLength = 2)]
        [RegularExpression(@"^(?!\s*$).+")]
        public string NameWorkTypes { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }
}
