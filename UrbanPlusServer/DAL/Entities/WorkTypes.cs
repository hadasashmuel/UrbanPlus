
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class WorkTypes
    {
        [Key]
        public int WorkTypeId { get; set; }

        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(200)]
        public string NameWorkTypes { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
        public virtual Categories? Category { get; set; }
        public virtual List<ProviderWorkTypes> ProviderWorkTypes { get; set; } = new();
    }
}
