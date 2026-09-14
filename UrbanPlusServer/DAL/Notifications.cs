using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DAL
{
    public class Notifications
    {
        [Key]
        public int NotificationId { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }

        [ForeignKey("MainEventId")]
        public int MainEventId { get; set; }

        public NotificationType Type { get; set; }

        [MaxLength(500)]
        public string Content { get; set; }

        [Range(0, int.MaxValue)]
        public double DistanceFromEvent { get; set; }
        public bool IsRead { get; set; }

        public DateTime CreatedAt { get; set; }

        public Users? User { get; set; }
        public MainEvents? MainEvent { get; set; }


    }
}
