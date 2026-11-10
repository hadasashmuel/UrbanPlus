
using DAL.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace DTO.AIChatMessagesDTO
{
    public class AIChatMessageResponseDTO
    {
        [Range(1, int.MaxValue)]
        public int AIChatMessageId { get; set; }

        [Range(1, int.MaxValue)]
        public int AIChatSessionId { get; set; }

        [Required]
        public SenderType SenderType { get; set; }

        [Required]
        [StringLength(4000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
