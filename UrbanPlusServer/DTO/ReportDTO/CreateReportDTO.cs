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
        public int CategoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string InputAddress { get; set; }
        public List<ShowReportImageDTO>? ImageList { get; set; } = new List<ShowReportImageDTO>();
    }
}
