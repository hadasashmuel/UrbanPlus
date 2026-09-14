using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL
{
    public class Categories
    {
        [Key]
        public int CategoryId { get; set; }

        [MaxLength(80)]
        public string CategoryName { get; set; }

        [MaxLength(200)]
        public string CategoryDescription { get; set; }

        public virtual List<Reports> Reports { get; set; }
        public virtual List<MainEvents> MainEvents { get; set; }

    }
}
