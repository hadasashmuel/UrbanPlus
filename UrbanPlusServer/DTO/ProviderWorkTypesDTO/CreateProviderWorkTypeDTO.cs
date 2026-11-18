using System.ComponentModel.DataAnnotations;

namespace DTO.ProviderWorkTypeDTO
{
    public class CreateProviderWorkTypeDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "ProviderId must be greater than 0")]
        public int ProviderId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "WorkTypeId must be greater than 0")]
        public int WorkTypeId { get; set; }
    }
}