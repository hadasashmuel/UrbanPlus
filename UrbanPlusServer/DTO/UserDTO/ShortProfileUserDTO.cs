using DAL;
using DTO.BadgeDTO;
using DTO.SaveEventDTO;
using DTO.VoteDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.UserDTO
{
    public class ShortProfileUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }
        public virtual List<ShowBadgeDTO> Badges { get; set; }
        public virtual List<ShowSavedEventsDTO> SavedEvents { get; set; }
    }
}
