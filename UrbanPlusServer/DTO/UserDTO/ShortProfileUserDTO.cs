using DTO.BadgeDTO;
using DTO.SaveEventDTO;
//using Microsoft.AspNetCore.Http;
namespace DTO.UserDTO
{
    public class ShortProfileUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public double ScoreReliability { get; set; }
        public DateTime CreatedAt { get; set; }
      //  public IFormFile? ProfilePicture { get; set; }
        public List<ShowBadgeDTO> Badges { get; set; }
        public List<ShowSavedEventsDTO> SavedEvents { get; set; }
    }
}
