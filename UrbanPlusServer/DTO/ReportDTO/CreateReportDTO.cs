
using DTO.ReportImageDTO;
using System.ComponentModel.DataAnnotations;

namespace DTO.ReportDTO
{
    public class CreateReportDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be greater than 0")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 100 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Title cannot contain only spaces")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 5, ErrorMessage = "Description must be between 5 and 1000 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Description cannot contain only spaces")]
        public string Description { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        public double Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        public double Longitude { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Address must be between 2 and 200 characters")]
        [RegularExpression(@"^(?!\s*$).+", ErrorMessage = "Address cannot contain only spaces")]
        public string InputAddress { get; set; }

        public List<CreateReportImageDTO>? ImageList { get; set; } = new List<CreateReportImageDTO>();
    }
}
