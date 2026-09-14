using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class AIChatMessages
    {
        [Key]
        public int AIChatMessageId { get; set; }

        [ForeignKey("AIChatSessionId")]
        public int AIChatSessionId { get; set; }
        public SenderType SenderType { get; set; }

        [MaxLength(4000)]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

      
        public AIChatSessions AIChatSession { get; set; }


    }
}
