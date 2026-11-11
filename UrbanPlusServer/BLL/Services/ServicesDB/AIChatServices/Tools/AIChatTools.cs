
using DAL.Repositories.MainEventRepositories;
using DAL.Repositories.CategoryRepositories;
using System.ComponentModel;

namespace BLL.Services.ServicesDB.AIChatServices.Tools
{
    public class AIChatTools
    {
        private readonly IMainEventRepository _mainEventRepository;
        private readonly ICategoryRepository _categoryRepository;

        public AIChatTools(IMainEventRepository mainEventRepository, ICategoryRepository categoryRepository)
        {
            _mainEventRepository = mainEventRepository;
            _categoryRepository = categoryRepository;
        }

        [Description("מחזיר רשימה של כל האירועים המרכזיים הקיימים במערכת UrbanPlus, כולל כותרת, סטטוס, כתובת, חומרה וזמן טיפול משוער.")]
        public List<object> GetAllMainEvents()
        {
            var events = _mainEventRepository.GetAllMainEvents();

            return events.Select(e => (object)new
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
            }).ToList();
        }

        [Description("מחזיר פרטים על אירוע מרכזי מסוים לפי מזהה האירוע.")]
        public object? GetMainEventById(
            [Description("המזהה המספרי של האירוע")] int eventId)
        {
            var e = _mainEventRepository.GetMainEventById(eventId);

            if (e == null)
                return null;

            return new
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
        }

        [Description("מחזיר את כל הקטגוריות הקיימות במערכת UrbanPlus ואת התיאור של כל קטגוריה.")]
        public List<object> GetAllCategories()
        {
            var categories = _categoryRepository.GetAllCategories();

            return categories.Select(c => (object)new
            {
                c.CategoryId,
                c.CategoryName,
                c.CategoryDescription
            }).ToList();
        }

        [Description("מחפש אירועים מרכזיים במערכת UrbanPlus לפי קטגוריה וכתובת. ניתן לבקש רק אירועים פתוחים. השתמש בכלי זה כאשר המשתמש מבקש למצוא אירועים במערכת.")]
        public List<object> SearchMainEvents(
        [Description("שם הקטגוריה לחיפוש, למשל תאורה, כבישים או ניקיון. אם לא צוין, השאר ריק.")]
        string? categoryName = null,

        [Description("כתובת או חלק מהכתובת לחיפוש. אם לא צוינה כתובת, השאר ריק.")]
         string? address = null,

        [Description("האם להציג רק אירועים פתוחים שטרם נסגרו או טופלו?")]
        bool onlyOpen = false)
        {
            var events = _mainEventRepository.SearchMainEvents( categoryName, address,onlyOpen);

            return events.Select(e => (object)new
            {
                e.MainEventsId,
                e.Title,
                Status = e.Status.ToString(),
                e.Address,
                CategoryName = e.Category?.CategoryName,
                Severity = e.Severity.ToString(),
                e.EstimatedResolutionMinutes,
                e.CreatedAt
            }).ToList();
        }
    }
}
