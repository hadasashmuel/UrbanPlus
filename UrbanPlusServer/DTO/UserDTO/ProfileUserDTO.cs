using DAL;
using DTO.BadgeDTO;
using DTO.SaveEventDTO;
using DTO.UserBadgeDTO;
using DTO.VoteDTO;

namespace DTO.UserDTO
{
    public class ProfileUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public AuthProvider AuthProvider { get; set; }
        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }
        public virtual List<ShowUserBadgeDTO> UserBadges { get; set; }
        public virtual List<ShowVoteDTO> Votes { get; set; }
        public virtual List<ShowSavedEventsDTO> SavedEvents { get; set; }
    }
}
