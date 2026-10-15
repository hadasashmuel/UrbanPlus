using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.SaveEventRepositories
{
    public class SaveEventRepository : ISaveEventRepository
    {
        private readonly UrbanPlusContext _context;

        public SaveEventRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<SavedEvents> GetByUserId(int userId)
        {
            return _context.SavedEvents
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .ToList();
        }

        public SavedEvents? GetById(int id, int userId)
        {
            return _context.SavedEvents
                .AsNoTracking()
                .FirstOrDefault(s =>
                    s.SavedEventId == id &&
                    s.UserId == userId);
        }

        public SavedEvents Add(SavedEvents savedEvent)
        {
            _context.SavedEvents.Add(savedEvent);
            _context.SaveChanges();

            return savedEvent;
        }

        public bool Delete(int id, int userId)
        {
            var savedEvent = _context.SavedEvents
                .FirstOrDefault(s =>
                    s.SavedEventId == id &&
                    s.UserId == userId);

            if (savedEvent == null)
                return false;

            _context.SavedEvents.Remove(savedEvent);
            _context.SaveChanges();

            return true;
        }
    }
}
