using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL.Entities
{
    public class ReportImages
    {
        [Key]
        public int ReportImageId { get; set; }

        [ForeignKey("ReportId")]
        public int ReportId { get; set; }
        public string ImageUrl { get; set; }

        public Reports? Report { get; set; }


    }
}
