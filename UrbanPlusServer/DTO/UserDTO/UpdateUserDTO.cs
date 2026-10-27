using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace DTO.UserDTO
{
    public class UpdateUserDTO
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
