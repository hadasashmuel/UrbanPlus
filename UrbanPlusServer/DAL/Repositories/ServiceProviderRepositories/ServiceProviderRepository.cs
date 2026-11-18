
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.ServiceProviderRepositories
{
    public class ServiceProviderRepository : IServiceProviderRepository
    {
        private readonly UrbanPlusContext _context;

        public ServiceProviderRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<ServiceProviders> GetAllServiceProviders()
        {
            return _context.ServiceProviders
                .AsNoTracking()
                .ToList();
        }

        public ServiceProviders? GetServiceProviderById(int id)
        {
            return _context.ServiceProviders
                .AsNoTracking()
                .FirstOrDefault(p => p.ProviderId == id);
        }

        public ServiceProviders AddServiceProvider(ServiceProviders provider)
        {
            _context.ServiceProviders.Add(provider);
            _context.SaveChanges();

            return provider;
        }

        public bool UpdateServiceProvider(ServiceProviders provider)
        {
            var existingProvider = _context.ServiceProviders
                .Find(provider.ProviderId);

            if (existingProvider == null)
                return false;

            existingProvider.FullName = provider.FullName;
            existingProvider.Department = provider.Department;
            existingProvider.Phone = provider.Phone;
            existingProvider.Email = provider.Email;
            existingProvider.IsActive = provider.IsActive;

            _context.SaveChanges();

            return true;
        }

        public List<ServiceProviders>? GetServiceProvidersForEvent(int eventId)
        {
            // שלב 1: מציאת הקטגוריה של האירוע
            var categoryId = _context.MainEvents
                .AsNoTracking()
                .Where(e => e.MainEventsId == eventId)
                .Select(e => (int?)e.CategoryId)
                .FirstOrDefault();

            // אם האירוע לא קיים
            if (categoryId == null)
                return null;

            // שלב 2: מציאת הספקים שמשויכים לסוגי עבודה
            // ששייכים לקטגוריה של האירוע
            var providers = _context.ProviderWorkTypes
                .AsNoTracking()
                .Where(pwt =>
                    pwt.WorkType != null &&
                    pwt.WorkType.CategoryId == categoryId &&
                    pwt.ServiceProvider != null &&
                    pwt.ServiceProvider.IsActive)
                .Select(pwt => pwt.ServiceProvider!)
                .Distinct()
                .ToList();

            return providers;
        }
    }
}
