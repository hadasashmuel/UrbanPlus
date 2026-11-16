
using DTO.BadgeDTO;

namespace BLL.Services.ServicesDB.BadgeServices
{
    public interface IBadgeService
    {
        List<ShowBadgeDTO> GetAllBadges();
        ShowBadgeDTO GetBadgeById(int id);
        ShowBadgeDTO CreateBadge(CreateBadgeDTO dto);
        ShowBadgeDTO UpdateBadge(int id, UpdateBadgeDTO dto);
        bool DeleteBadge(int id);
    }
}
