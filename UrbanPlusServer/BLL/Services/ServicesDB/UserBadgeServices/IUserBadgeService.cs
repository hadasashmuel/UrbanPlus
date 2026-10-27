using DTO.BadgeDTO;
using DTO.UserBadgeDTO;

namespace BLL.Services.ServicesDB.UserBadgeServices
{
    public interface IUserBadgeService
    {
        List<ShowUserBadgeDTO> GetBadgesByUserId(int userId);

        ShowUserBadgeDTO? GetUserBadgeById(int id);

        ShowUserBadgeDTO AwardBadgeToUser(int userId, int badgeId);
        List<ShowBadgeDTO> GetMine(int userId);

        bool DeleteUserBadge(int id);
    }
}
