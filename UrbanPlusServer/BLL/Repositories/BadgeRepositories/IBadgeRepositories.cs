using DTO.BadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.BadgeRepositories
{
    public interface IBadgeRepositories
    {
        List<ShowBadgeDTO> GetAllBadges();
        ShowBadgeDTO? GetBadgeById(int id);
        ShowBadgeDTO CreateBadge(CreateBadgeDTO dto);
        bool DeleteBadge(int id);
    }
}
