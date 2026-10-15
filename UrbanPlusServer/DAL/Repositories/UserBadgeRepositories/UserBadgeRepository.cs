using DAL.Entities;
using Microsoft.EntityFrameworkCore;


namespace DAL.Repositories.UserBadgeRepositories
{
    public class UserBadgeRepository : IUserBadgeRepository
    {
        private readonly UrbanPlusContext _context;

        public UserBadgeRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<UserBadges> GetAll()
        {
            return _context.UserBadges.AsNoTracking().ToList();
        }

        public UserBadges? GetById(int id)
        {
            return _context.UserBadges.AsNoTracking().FirstOrDefault(ub => ub.UserBadgeId == id);
        }

        public bool Delete(int id)
        {
            var userBadge = _context.UserBadges.Find(id);

            if (userBadge == null)
                return false;

            _context.UserBadges.Remove(userBadge);
            _context.SaveChanges();

            return true;
        }
    }
}
