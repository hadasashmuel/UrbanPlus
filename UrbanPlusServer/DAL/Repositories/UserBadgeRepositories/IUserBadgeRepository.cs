using DAL.Entities;

namespace DAL.Repositories.UserBadgeRepositories
{
    public interface IUserBadgeRepository
    {
        List<UserBadges> GetByUserId(int userId);

        UserBadges? GetById(int id);

        bool ExistsForUserAndBadge(int userId, int badgeId);

        UserBadges Add(UserBadges userBadge);

        bool Delete(int id);
    }
}
