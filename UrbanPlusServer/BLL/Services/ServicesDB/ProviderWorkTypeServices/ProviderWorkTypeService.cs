using AutoMapper;
using DAL.Entities;
using DAL.Repositories.ProviderWorkTypeRepositories;
using DAL.Repositories.ServiceProviderRepositories;
using DAL.Repositories.WorkTypeRepositories;
using DTO.ProviderWorkTypeDTO;

namespace BLL.Services.ServicesDB.ProviderWorkTypeServices
{
    public class ProviderWorkTypeService : IProviderWorkTypeService
    {
        private readonly IProviderWorkTypeRepository _providerWorkTypeRepository;
        private readonly IServiceProviderRepository _serviceProviderRepository;
        private readonly IWorkTypeRepository _workTypeRepository;
        private readonly IMapper _mapper;

        public ProviderWorkTypeService(
            IProviderWorkTypeRepository providerWorkTypeRepository,
            IServiceProviderRepository serviceProviderRepository,
            IWorkTypeRepository workTypeRepository,
            IMapper mapper)
        {
            _providerWorkTypeRepository = providerWorkTypeRepository;
            _serviceProviderRepository = serviceProviderRepository;
            _workTypeRepository = workTypeRepository;
            _mapper = mapper;
        }

        public List<ShowProviderWorkTypeDTO> GetAllProviderWorkTypes()
        {
            var providerWorkTypes =
                _providerWorkTypeRepository.GetAllProviderWorkTypes();

            return _mapper.Map<List<ShowProviderWorkTypeDTO>>(providerWorkTypes);
        }

        public ShowProviderWorkTypeDTO GetProviderWorkTypeById(int id)
        {
            var providerWorkType =
                _providerWorkTypeRepository.GetProviderWorkTypeById(id);

            if (providerWorkType == null)
                throw new Exception("Provider work type not found");

            return _mapper.Map<ShowProviderWorkTypeDTO>(providerWorkType);
        }

        public List<ShowProviderWorkTypeDTO> GetByProviderId(int providerId)
        {
            var providerWorkTypes =
                _providerWorkTypeRepository.GetByProviderId(providerId);

            return _mapper.Map<List<ShowProviderWorkTypeDTO>>(providerWorkTypes);
        }

        public ShowProviderWorkTypeDTO CreateProviderWorkType(
            CreateProviderWorkTypeDTO dto)
        {
            var provider =
                _serviceProviderRepository.GetServiceProviderById(dto.ProviderId);

            if (provider == null)
                throw new Exception("Service provider not found");

            if (!provider.IsActive)
                throw new Exception("Service provider is not active");

            var workType =
                _workTypeRepository.GetWorkTypeById(dto.WorkTypeId);

            if (workType == null)
                throw new Exception("Work type not found");

            var existingMappings =
                _providerWorkTypeRepository.GetByProviderId(dto.ProviderId);

            if (existingMappings.Any(p => p.WorkTypeId == dto.WorkTypeId))
                throw new Exception("This provider is already assigned to this work type");

            var providerWorkType =
                _mapper.Map<ProviderWorkTypes>(dto);

            var createdProviderWorkType =
                _providerWorkTypeRepository.AddProviderWorkType(providerWorkType);

            return _mapper.Map<ShowProviderWorkTypeDTO>(
                createdProviderWorkType);
        }

        public bool DeleteProviderWorkType(int id)
        {
            var deleted =
                _providerWorkTypeRepository.DeleteProviderWorkType(id);

            if (!deleted)
                throw new Exception("Provider work type not found");

            return true;
        }
    }
}