using DAL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.AIChatMessagesDTO
{
    public class AIChatMessageResponseDTO
    {
        [Range(1, int.MaxValue)]
        public int AIChatMessageId { get; set; }

        [Required]
        public SenderType SenderType { get; set; }

        [Required]
        [StringLength(4000)]
        public string Content { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
