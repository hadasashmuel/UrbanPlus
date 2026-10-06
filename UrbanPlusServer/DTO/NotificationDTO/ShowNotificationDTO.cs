using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.NotificationDTO
{
    public class ShowNotificationDTO
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public int MainEventId { get; set; }
        public NotificationType Type { get; set; }
        public string Content { get; set; }
        public double DistanceFromEvent { get; set; }
        public bool IsRead { get; set; }
        public string TitleMainEvent { get; set; }
    }
}
