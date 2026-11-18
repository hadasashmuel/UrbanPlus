
using DTO.ServiceProviderDTO;

namespace BLL.Services.ServicesDB.ServiceProviderServices
{
    public interface IServiceProviderService
    {
        List<ShowServiceProviderDTO> GetAllServiceProviders();
        ShowServiceProviderDTO GetServiceProviderById(int id);
        ShowServiceProviderDTO CreateServiceProvider(CreateServiceProviderDTO dto);
        bool UpdateServiceProvider(UpdateServiceProviderDTO dto);
        List<ShowServiceProviderDTO>? GetServiceProvidersForEvent(int eventId);
    }
}
