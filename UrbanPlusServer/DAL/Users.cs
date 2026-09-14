using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [MaxLength(200)]
        public string FirstName { get; set; }

        [MaxLength(200)]
        public string LastName { get; set; }

        [MaxLength(320)]
        public string Email { get; set; }

        public AuthProvider AuthProvider { get; set; }
        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual List<UserBadges> UserBadges { get; set; }
        public virtual List<Votes> Votes { get; set; }
        public virtual List<SavedEvents> SavedEvents { get; set; }
        public virtual List<Reports> Reports { get; set; }
        public virtual List<Notifications> Notifications { get; set; }
        public virtual List<AIChatSessions> AIChatSessions { get; set; }
        public virtual List<Message> Messages { get; set; }


    }
}
