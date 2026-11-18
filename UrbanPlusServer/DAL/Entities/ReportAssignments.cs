
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class ReportAssignments
    {
        [Key]
        public int AssignmentId { get; set; }

        [ForeignKey("ReportId")]
        public int ReportId { get; set; }

        [ForeignKey("ProviderId")]
        public int ProviderId { get; set; }

        [ForeignKey("ManagerId")]
        public int ManagerId { get; set; }

        public DateTime AssignedAt { get; set; }

        public bool IsCurrent { get; set; } = true;

        public virtual Users? Manager { get; set; }
        public virtual Reports? Report { get; set; }
        public virtual ServiceProviders? ServiceProvider { get; set; }
    }
}