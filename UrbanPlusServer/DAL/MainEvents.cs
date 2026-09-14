using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class MainEvents
    {
        [Key]
        public int MainEventsId { get; set; }

        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }

        [MaxLength(80)]
        public string Title { get; set; }
        public EventStatus Status { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        [MaxLength(100)]
        public string Address { get; set; }
        public Severity Severity { get; set; }

        [Range(0, int.MaxValue)]
        public int EstimatedResolutionMinutes { get; set; }
        public DateTime CreatedAt { get; set; }

        public DateTime? StartedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public int? ActualResolutionMinutes { get; set; }


        public Categories? Category { get; set; }
        public virtual List<Votes> Votes { get; set; }
        public virtual List<SavedEvents> SavedEvents { get; set; }
        public virtual List<Reports> Reports { get; set; }
        public virtual List<Notifications> Notifications { get; set; }
        public virtual List<AIChatSessions> AIChatSessions { get; set; }
        public virtual List<Message> Messages { get; set; }


    }
}
