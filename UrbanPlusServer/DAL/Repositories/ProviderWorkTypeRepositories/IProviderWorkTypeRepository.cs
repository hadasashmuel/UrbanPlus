using DAL.Entities;

namespace DAL.Repositories.ProviderWorkTypeRepositories
{
    public interface IProviderWorkTypeRepository
    {
        List<ProviderWorkTypes> GetAllProviderWorkTypes();
        ProviderWorkTypes? GetProviderWorkTypeById(int id);
        List<ProviderWorkTypes> GetByProviderId(int providerId);
        ProviderWorkTypes AddProviderWorkType(ProviderWorkTypes providerWorkType);
        bool DeleteProviderWorkType(int id);
    }
}