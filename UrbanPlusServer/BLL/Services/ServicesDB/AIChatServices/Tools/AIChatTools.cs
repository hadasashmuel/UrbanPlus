
using DAL.Repositories.MainEventRepositories;
using DAL.Repositories.CategoryRepositories;
using System.ComponentModel;
using System.Diagnostics;

namespace BLL.Services.ServicesDB.AIChatServices.Tools
{
    public class AIChatTools
    {
        private readonly IMainEventRepository _mainEventRepository;
        private readonly ICategoryRepository _categoryRepository;

        private const int MaxEvents = 20;
        private const int MaxCategories = 30;
        private const int MaxSearchResults = 10;

        public AIChatTools(
            IMainEventRepository mainEventRepository,
            ICategoryRepository categoryRepository)
        {
            _mainEventRepository = mainEventRepository;
            _categoryRepository = categoryRepository;
        }

        [Description("מחזיר עד 20 אירועים מרכזיים ממערכת UrbanPlus, כולל כותרת, סטטוס, כתובת, חומרה וזמן טיפול משוער.")]
        public List<object> GetAllMainEvents()
        {
            Console.WriteLine("GetAllMainEvents START");

            var timer = Stopwatch.StartNew();

            var events = _mainEventRepository.GetAllMainEvents();

            Console.WriteLine($"DB QUERY FINISHED: {timer.ElapsedMilliseconds} ms");
            Console.WriteLine($"EVENTS COUNT: {events.Count}");

            var result = events
                .Take(MaxEvents)
                .Select(e => (object)new
                {
                    e.MainEventsId,
                    e.Title,
                    Status = e.Status.ToString(),
                    e.Address,
                    Severity = e.Severity.ToString(),
                    e.EstimatedResolutionMinutes,
                    e.CreatedAt,
                    e.Latitude,
                    e.Longitude,
                    e.CategoryId
                })
                .ToList();

            Console.WriteLine($"GetAllMainEvents END: {timer.ElapsedMilliseconds} ms");

            return result;
        }

        [Description("מחזיר פרטים על אירוע מרכזי מסוים לפי מזהה האירוע.")]
        public object? GetMainEventById(
            [Description("המזהה המספרי של האירוע")] int eventId)
        {
            Console.WriteLine("GetMainEventById START");

            var timer = Stopwatch.StartNew();

            var e = _mainEventRepository.GetMainEventById(eventId);

            Console.WriteLine($"GetMainEventById DB: {timer.ElapsedMilliseconds} ms");

            if (e == null)
                return null;

            var result = new
            {
                e.MainEventsId,
                e.Title,
                Status = e.Status.ToString(),
                e.Address,
                Severity = e.Severity.ToString(),
                e.EstimatedResolutionMinutes,
                e.CreatedAt,
                e.StartedAt,
                e.ResolvedAt,
                e.ActualResolutionMinutes,
                e.Latitude,
                e.Longitude,
                e.CategoryId
            };

            Console.WriteLine($"GetMainEventById END: {timer.ElapsedMilliseconds} ms");

            return result;
        }

        [Description("מחזיר עד 30 קטגוריות ממערכת UrbanPlus.")]
        public List<object> GetAllCategories()
        {
            Console.WriteLine("GetAllCategories START");

            var timer = Stopwatch.StartNew();

            var categories = _categoryRepository.GetAllCategories();

            Console.WriteLine($"Categories DB: {timer.ElapsedMilliseconds} ms");
            Console.WriteLine($"CATEGORIES COUNT: {categories.Count}");

            var result = categories
                .Take(MaxCategories)
                .Select(c => (object)new
                {
                    c.CategoryId,
                    c.CategoryName,
                    c.CategoryDescription
                })
                .ToList();

            Console.WriteLine($"GetAllCategories END: {timer.ElapsedMilliseconds} ms");

            return result;
        }

        [Description("מחפש עד 10 אירועים מרכזיים במערכת UrbanPlus לפי קטגוריה וכתובת. ניתן לבקש רק אירועים פתוחים.")]
        public List<object> SearchMainEvents(
            [Description("שם הקטגוריה לחיפוש, למשל תאורה, כבישים או ניקיון. אם לא צוין, השאר ריק.")]
            string? categoryName = null,

            [Description("כתובת או חלק מהכתובת לחיפוש. אם לא צוינה כתובת, השאר ריק.")]
            string? address = null,

            [Description("האם להציג רק אירועים פתוחים שטרם נסגרו או טופלו?")]
            bool onlyOpen = false)
        {
            Console.WriteLine("SearchMainEvents START");

            var timer = Stopwatch.StartNew();

            var events = _mainEventRepository.SearchMainEvents(
                categoryName,
                address,
                onlyOpen);

            Console.WriteLine($"Search DB: {timer.ElapsedMilliseconds} ms");
            Console.WriteLine($"SEARCH RESULTS COUNT: {events.Count}");

            var result = events
                .Take(MaxSearchResults)
                .Select(e => (object)new
                {
                    e.MainEventsId,
                    e.Title,
                    Status = e.Status.ToString(),
                    e.Address,
                    CategoryName = e.Category?.CategoryName,
                    Severity = e.Severity.ToString(),
                    e.EstimatedResolutionMinutes,
                    e.CreatedAt
                })
                .ToList();

            Console.WriteLine($"SearchMainEvents END: {timer.ElapsedMilliseconds} ms");

            return result;
        }
    }
}
