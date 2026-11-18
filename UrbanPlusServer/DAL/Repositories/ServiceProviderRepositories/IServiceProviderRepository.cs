using DAL.Entities;

namespace DAL.Repositories.ServiceProviderRepositories
{
    public interface IServiceProviderRepository
    {
        List<ServiceProviders> GetAllServiceProviders();
        ServiceProviders? GetServiceProviderById(int id);
        ServiceProviders AddServiceProvider(ServiceProviders provider);
        bool UpdateServiceProvider(ServiceProviders provider);
        List<ServiceProviders>? GetServiceProvidersForEvent(int eventId);
    }
}