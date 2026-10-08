using DTO.UserBadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.UserBadgeRepositories
{
    public interface IUserBadgeRepositories
    {
        List<ShowUserBadgeDTO> GetAllUserBadges();
        ShowUserBadgeDTO? GetUserBadgeById(int id);
        bool DeleteUserBadge(int id);
    }
}
