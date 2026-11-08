
using System.ComponentModel.DataAnnotations;

namespace DTO.SaveEventDTO
{
    public class CreateSaveEventDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "MainEventId must be greater than 0")]
        public int MainEventId { get; set; }
    }
}
