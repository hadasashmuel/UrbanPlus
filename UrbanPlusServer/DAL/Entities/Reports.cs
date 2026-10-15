using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Entities
{
    public class Reports
    {
        [Key]
        public int ReportId { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [ForeignKey("MainEventId")]
        public int? MainEventId { get; set; }

        [ForeignKey("CategoryId")]
        public int CategoryId { get; set; }

        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        [MaxLength(300)]
        public string InputAddress { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<ReportImages> Images { get; set; } = new();
        public Users? User { get; set; }
        public MainEvents? MainEvent { get; set; }
        public Categories? Category { get; set; }

    }
}
