using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DAL.Entities
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [MaxLength(200)]
        public string FirstName { get; set; }

        [MaxLength(200)]
        public string LastName { get; set; }

        [MaxLength(300)]
        public string Email { get; set; }

        [MinLength(8)]
        public string passwordHash { get; set; } = string.Empty;
        public AuthProvider AuthProvider { get; set; }

        [Range(1, 100)]
        public double ScoreReliability { get; set; }
        public string ProfilePicture { get; set; }

        // 0 = User, 1 = Admin
        public int RoleCode { get; set; }
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
