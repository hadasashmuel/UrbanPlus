using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class AIChatSessions
    {
        [Key]
        public int AIChatSessionId { get; set; }
        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [ForeignKey("MainEventId")]
        public int? MainEventId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? ClosedAt { get; set; }


        public Users User { get; set; }
        public MainEvents? MainEvent { get; set; }

        public virtual List<AIChatMessages> AIChatMessages { get; set; }
    }
}
