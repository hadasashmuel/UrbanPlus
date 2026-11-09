using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.UserDTO
{
    public class AuthResponseUserDto
    {
        public string Token { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
    }
}
