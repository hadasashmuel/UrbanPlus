
using System.ComponentModel.DataAnnotations;

namespace DTO.AIChatMessagesDTO
{
    public class SendAIMessageDTO
    {
        [Required(ErrorMessage = "Message content is required")]
        [StringLength(4000, MinimumLength = 1,ErrorMessage = "Message must be between 1 and 4000 characters")]
        [RegularExpression(@"^(?!\s*$).+",ErrorMessage = "Message cannot contain only spaces")]
        public string Content { get; set; } = string.Empty;

        [Range(1,int.MaxValue,ErrorMessage = "Chat session ID must be a positive number")]
        public int? AIChatSessionId { get; set; }

        [Range(1,int.MaxValue,ErrorMessage = "Main event ID must be a positive number")]
        public int? MainEventId { get; set; }
    }
}
