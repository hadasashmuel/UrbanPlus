using DTO.BadgeDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.BadgeServices
{
    public interface IBadgeService
    {
        List<ShowBadgeDTO> GetAllBadges();
        ShowBadgeDTO? GetBadgeById(int id);
        ShowBadgeDTO CreateBadge(CreateBadgeDTO dto);
        bool DeleteBadge(int id);
    }
}
