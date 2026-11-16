
using DAL.Entities;

namespace DAL.Repositories.BadgeRepositories
{
    public interface IBadgeRepository
    {
        List<Badges> GetAllBadges();
        Badges? GetBadgeById(int id);
        Badges AddBadge(Badges badge);
        bool UpdateBadge(Badges badge);
        bool DeleteBadge(int id);
    }
}
