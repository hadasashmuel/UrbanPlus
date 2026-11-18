using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.ProviderWorkTypeRepositories
{
    public class ProviderWorkTypeRepository : IProviderWorkTypeRepository
    {
        private readonly UrbanPlusContext _context;

        public ProviderWorkTypeRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<ProviderWorkTypes> GetAllProviderWorkTypes()
        {
            return _context.ProviderWorkTypes
                .AsNoTracking()
                .Include(p => p.ServiceProvider)
                .Include(p => p.WorkType)
                .ToList();
        }

        public ProviderWorkTypes? GetProviderWorkTypeById(int id)
        {
            return _context.ProviderWorkTypes
                .AsNoTracking()
                .Include(p => p.ServiceProvider)
                .Include(p => p.WorkType)
                .FirstOrDefault(p => p.ProviderWorkTypesId == id);
        }

        public List<ProviderWorkTypes> GetByProviderId(int providerId)
        {
            return _context.ProviderWorkTypes
                .AsNoTracking()
                .Include(p => p.ServiceProvider)
                .Include(p => p.WorkType)
                .Where(p => p.ProviderId == providerId)
                .ToList();
        }

        public ProviderWorkTypes AddProviderWorkType(ProviderWorkTypes providerWorkType)
        {
            _context.ProviderWorkTypes.Add(providerWorkType);
            _context.SaveChanges();

            return _context.ProviderWorkTypes
                .AsNoTracking()
                .Include(p => p.ServiceProvider)
                .Include(p => p.WorkType)
                .First(p => p.ProviderWorkTypesId == providerWorkType.ProviderWorkTypesId);
        }

        public bool DeleteProviderWorkType(int id)
        {
            var providerWorkType = _context.ProviderWorkTypes.Find(id);

            if (providerWorkType == null)
                return false;

            _context.ProviderWorkTypes.Remove(providerWorkType);
            _context.SaveChanges();

            return true;
        }
    }
}