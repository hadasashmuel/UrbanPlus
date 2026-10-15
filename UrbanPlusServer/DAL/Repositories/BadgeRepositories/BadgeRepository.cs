
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.BadgeRepositories
{
    public class BadgeRepository : IBadgeRepository
    {
        private readonly UrbanPlusContext _context;

        public BadgeRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Badges> GetAllBadges()
        {
            return _context.Badges.AsNoTracking().ToList();
        }

        public Badges? GetBadgeById(int id)
        {
            return _context.Badges .AsNoTracking().FirstOrDefault(b => b.BadgeId == id);
        }

        public Badges AddBadge(Badges badge)
        {
            _context.Badges.Add(badge);
            _context.SaveChanges();

            return badge;
        }

        public bool DeleteBadge(int id)
        {
            var badge = _context.Badges
                .FirstOrDefault(b => b.BadgeId == id);

            if (badge == null)
                return false;

            _context.Badges.Remove(badge);
            _context.SaveChanges();

            return true;
        }
    }
}
