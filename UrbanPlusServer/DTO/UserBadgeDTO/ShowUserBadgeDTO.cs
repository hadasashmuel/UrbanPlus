using DAL;
using System;
using System.Collections.Generic;
using System.Text;

namespace DTO.UserBadgeDTO
{
    public class ShowUserBadgeDTO
    {
        public int BadgeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
