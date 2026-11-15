
using System.ComponentModel.DataAnnotations;

namespace DTO.MainEventDTO
{
    public class DeleteMainEventDTO
    {
        [Required(ErrorMessage = "Deletion reason is required.")]
        [MinLength(3, ErrorMessage = "Reason must contain at least 3 characters.")]
        public string Reason { get; set; }
    }
}