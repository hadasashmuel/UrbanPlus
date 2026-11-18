
using AutoMapper;
using DAL.Entities;
using DAL.Repositories.ServiceProviderRepositories;
using DTO.ServiceProviderDTO;

namespace BLL.Services.ServicesDB.ServiceProviderServices
{
    public class ServiceProviderService : IServiceProviderService
    {
        private readonly IServiceProviderRepository _serviceProviderRepository;
        private readonly IMapper _mapper;

        public ServiceProviderService(
            IServiceProviderRepository serviceProviderRepository,
            IMapper mapper)
        {
            _serviceProviderRepository = serviceProviderRepository;
            _mapper = mapper;
        }

        public List<ShowServiceProviderDTO> GetAllServiceProviders()
        {
            var providers =
                _serviceProviderRepository.GetAllServiceProviders();

            return _mapper.Map<List<ShowServiceProviderDTO>>(providers);
        }

        public ShowServiceProviderDTO GetServiceProviderById(int id)
        {
            var provider =
                _serviceProviderRepository.GetServiceProviderById(id);

            if (provider == null)
                throw new Exception("Service provider not found");

            return _mapper.Map<ShowServiceProviderDTO>(provider);
        }

        public ShowServiceProviderDTO CreateServiceProvider(
            CreateServiceProviderDTO dto)
        {
            var provider = _mapper.Map<ServiceProviders>(dto);

            var createdProvider =
                _serviceProviderRepository.AddServiceProvider(provider);

            return _mapper.Map<ShowServiceProviderDTO>(createdProvider);
        }

        public bool UpdateServiceProvider(UpdateServiceProviderDTO dto)
        {
            var provider = _mapper.Map<ServiceProviders>(dto);

            var updated =
                _serviceProviderRepository.UpdateServiceProvider(provider);

            if (!updated)
                throw new Exception("Service provider not found");

            return true;
        }

        public List<ShowServiceProviderDTO>? GetServiceProvidersForEvent(int eventId)
        {
            var providers =
                _serviceProviderRepository.GetServiceProvidersForEvent(eventId);

            if (providers == null)
                return null;

            return _mapper.Map<List<ShowServiceProviderDTO>>(providers);
        }
    }
}
