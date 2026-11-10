using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.AIChatMessagesDTO
{
    public class AIChatStreamChunkDTO
    {
        public int AIChatSessionId { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
