
using System.ComponentModel.DataAnnotations;

namespace DTO.MessageDTO
{
    public class CreateMessageDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "MainEventId must be greater than 0")]
        public int MainEventId { get; set; }

        [Required(ErrorMessage = "Message content is required")]
        [StringLength(1000, MinimumLength = 1, ErrorMessage = "Message content must be between 1 and 1000 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Message content cannot contain only spaces")]
        public string Content { get; set; }
    }
}
