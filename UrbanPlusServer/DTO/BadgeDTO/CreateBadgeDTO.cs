using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.BadgeDTO
{
    public class CreateBadgeDTO
    {
        public string BadgeName { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
    }
}
