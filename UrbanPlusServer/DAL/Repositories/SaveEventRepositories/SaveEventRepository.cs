
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

        public List<SavedEvents> GetAll()
        {
            return _context.SavedEvents.AsNoTracking().ToList();
        }

        public SavedEvents? GetById(int id)
        {
            return _context.SavedEvents.AsNoTracking().FirstOrDefault(s => s.SavedEventId == id);
        }

        public SavedEvents Add(SavedEvents savedEvent)
        {
            _context.SavedEvents.Add(savedEvent);
            _context.SaveChanges();

            return savedEvent;
        }

        public bool Delete(int id)
        {
            var savedEvent = _context.SavedEvents.Find(id);

            if (savedEvent == null)
                return false;

            _context.SavedEvents.Remove(savedEvent);
            _context.SaveChanges();

            return true;
        }
    }
}
