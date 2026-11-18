using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DAL.Entities
{
    public class ServiceProviders
    {
        [Key]
        public int ProviderId { get; set; }

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Department { get; set; }

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(300)]
        public string? Email { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual List<ProviderWorkTypes> ProviderWorkTypes { get; set; } = new();

        // היסטוריית הדיווחים ששויכו לספק
        public virtual List<ReportAssignments> Assignments { get; set; } = new();
    }
}