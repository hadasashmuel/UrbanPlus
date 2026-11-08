
using DAL.Entities;
using System.ComponentModel.DataAnnotations;

namespace DTO.UserDTO
{
    public class LoginUserDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [EnumDataType(typeof(AuthProvider), ErrorMessage = "Invalid authentication provider")]
        public AuthProvider AuthProvider { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password must contain at least 8 characters")]
        public string password { get; set; }
    }
}
