using DAL;
using DTO.BadgeDTO;
using DTO.SaveEventDTO;
using DTO.VoteDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.UserDTO
{
    public class UpdateUserDTO
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
