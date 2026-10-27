using DAL.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.UserDTO
{
    public class LoginUserDTO
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        public AuthProvider AuthProvider { get; set; }
        [Required, MinLength(8)]
        public string passwordHash { get; set; }


    }
}
