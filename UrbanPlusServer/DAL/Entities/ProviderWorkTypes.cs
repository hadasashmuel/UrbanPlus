
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class ProviderWorkTypes
    {
        [Key]
        public int ProviderWorkTypesId { get; set; }

        [ForeignKey("ProviderId")]
        public int ProviderId { get; set; }

        [ForeignKey("WorkTypeId")]
        public int WorkTypeId { get; set; }

        public virtual ServiceProviders? ServiceProvider { get; set; }

        public virtual WorkTypes? WorkType { get; set; }
    }
}
