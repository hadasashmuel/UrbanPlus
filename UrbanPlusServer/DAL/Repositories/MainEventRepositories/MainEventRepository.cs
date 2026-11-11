
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
        public List<MainEvents> GetCandidateEvents(int categoryId, DateTime since)
        {
            return _context.MainEvents
                .AsNoTracking()
                .Include(e => e.Reports)
                .Where(e =>
                    e.CategoryId == categoryId &&
                    e.CreatedAt >= since &&
                    (e.Status == EventStatus.New ||
                     e.Status == EventStatus.Verified ||
                     e.Status == EventStatus.InTreatment))
                .ToList();
        }
        public string? GetCategoryName(int categoryId)
        {
            return _context.Categories
                .Where(c => c.CategoryId == categoryId)
                .Select(c => c.CategoryName)
                .FirstOrDefault();
        }
        public List<MainEvents> SearchMainEvents( string? categoryName, string? address,bool onlyOpen)
        {
            var query = _context.MainEvents
                .AsNoTracking()
                .Include(e => e.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(categoryName))
            {
                query = query.Where(e =>
                    e.Category != null &&
                    e.Category.CategoryName.Contains(categoryName));
            }

            if (!string.IsNullOrWhiteSpace(address))
            {
                query = query.Where(e =>
                    e.Address.Contains(address));
            }

            if (onlyOpen)
            {
                query = query.Where(e =>
                    e.Status == EventStatus.New ||
                    e.Status == EventStatus.Verified ||
                    e.Status == EventStatus.InTreatment);
            }

            return query.ToList();
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
