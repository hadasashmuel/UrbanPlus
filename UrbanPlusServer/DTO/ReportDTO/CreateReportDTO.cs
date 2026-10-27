using DAL;
using DTO.ReportImageDTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.ReportDTO
{
    public class CreateReportDTO
    {
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public string Title { get; set; }
        public string Description { get; set; }
        [Range(-90, 90)]
        public double Latitude { get; set; }
        [Range(-180, 180)]
        public double Longitude { get; set; }
        [Required]
        public string InputAddress { get; set; }
        public List<CreateReportImageDTO>? ImageList { get; set; } = new List<CreateReportImageDTO>();
    }
}
