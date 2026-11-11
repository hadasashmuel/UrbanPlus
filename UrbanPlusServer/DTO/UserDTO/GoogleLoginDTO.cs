using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO.UserDTO
{
    public class GoogleLoginDTO
    {
        [Required]
        public string IdToken { get; set; }
    }
}
