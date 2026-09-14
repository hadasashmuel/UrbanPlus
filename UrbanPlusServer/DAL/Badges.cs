using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL
{
    public class Badges
    {
        [Key]
        public int BadgeId { get; set; }

        [MaxLength(80)]
        public string BadgeName { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }
        public string IconUrl { get; set; }

        public virtual List<UserBadges> UserBadges { get; set; }

    }
}
