using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.ReportDTO
{
    public class ShowReportDTO
    {
        public class Reports
        {
            public int ReportId { get; set; }
            public int UserId { get; set; }
            public int? MainEventId { get; set; }
            public int CategoryId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public string InputAddress { get; set; }
            public DateTime CreatedAt { get; set; }
            public List<string>? ImageList { get; set; } = new List<string>();
            public string CategoryName { get; set; }

        }
    }
}
