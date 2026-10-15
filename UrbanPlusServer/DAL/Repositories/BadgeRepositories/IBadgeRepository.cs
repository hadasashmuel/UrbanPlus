using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.BadgeRepositories
{
    public interface IBadgeRepository
    {
        List<Badges> GetAllBadges();
        Badges? GetBadgeById(int id);
        Badges AddBadge(Badges badge);
        bool DeleteBadge(int id);
    }
}
