
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.MainEventRepositories
{
    public class MainEventRepository : IMainEventRepository
    {
        private readonly UrbanPlusContext _context;

        public MainEventRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<MainEvents> GetAllMainEvents()
        {
            return _context.MainEvents.AsNoTracking().ToList();
        }

        public MainEvents? GetMainEventById(int id)
        {
            return _context.MainEvents.AsNoTracking().FirstOrDefault(e => e.MainEventsId == id);
        }

        public MainEvents AddMainEvent(MainEvents mainEvent)
        {
            _context.MainEvents.Add(mainEvent);
            _context.SaveChanges();

            return mainEvent;
        }

        public bool UpdateMainEvent(MainEvents mainEvent)
        {
            var existingEvent = _context.MainEvents
                .FirstOrDefault(e =>
                    e.MainEventsId == mainEvent.MainEventsId);

            if (existingEvent == null)
                return false;

            _context.Entry(existingEvent).CurrentValues.SetValues(mainEvent);

            _context.SaveChanges();

            return true;
        }

        public bool DeleteMainEvent(int id)
        {
            var mainEvent = _context.MainEvents .FirstOrDefault(e => e.MainEventsId == id);

            if (mainEvent == null)
                return false;

            _context.MainEvents.Remove(mainEvent);
            _context.SaveChanges();

            return true;
        }
    }
}
