
using DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace DTO.MainEventDTO
{
    public class UpdateMainEventDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0")]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 100 characters")]
        public string Title { get; set; }

        [Required]
        [EnumDataType(typeof(EventStatus), ErrorMessage = "Invalid event status")]
        public EventStatus Status { get; set; }

        [Required]
        [EnumDataType(typeof(Severity), ErrorMessage = "Invalid severity")]
        public Severity Severity { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "EstimatedResolutionMinutes must be greater than 0")]
        public int EstimatedResolutionMinutes { get; set; }
    }
}
