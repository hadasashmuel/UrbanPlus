using DTO.UserBadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.UserBadgeServices
{
    public interface IUserBadgeService
    {
        List<ShowUserBadgeDTO> GetAllUserBadges();
        ShowUserBadgeDTO? GetUserBadgeById(int id);
        bool DeleteUserBadge(int id);
    }
}
