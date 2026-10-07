using DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.UserDTO
{
    public class LoginUserDTO
    {
        public string Email { get; set; }
        public AuthProvider AuthProvider { get; set; }
      
    }
}
