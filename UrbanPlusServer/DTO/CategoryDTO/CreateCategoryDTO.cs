
using System.ComponentModel.DataAnnotations;

namespace DTO.CategoryDTO
{
    public class CreateCategoryDTO
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Category name must be between 2 and 50 characters")]
        public string CategoryName { get; set; }

        [StringLength(250, ErrorMessage = "Category description cannot exceed 250 characters")]
        public string CategoryDescription { get; set; }
    }
}
