using DAL.Entities;
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
       public string? ProfilePicture { get; set; }

        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<ShowUserBadgeDTO> UserBadges { get; set; }
        public List<ShowVoteDTO> Votes { get; set; }
        public List<ShowSavedEventsDTO> SavedEvents { get; set; }
    }
}
