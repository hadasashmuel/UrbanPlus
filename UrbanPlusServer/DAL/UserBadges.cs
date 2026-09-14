using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class UserBadges
    {
        [Key]
        public int UserBadgeId { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [ForeignKey("BadgeId")]
        public int BadgeId { get; set; }

        public DateTime CreatedAt { get; set; }

        public Users? User { get; set; }
        public Badges? Badge { get; set; }

    }
}
