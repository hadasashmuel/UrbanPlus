using DTO.ProviderWorkTypeDTO;

namespace BLL.Services.ServicesDB.ProviderWorkTypeServices
{
    public interface IProviderWorkTypeService
    {
        List<ShowProviderWorkTypeDTO> GetAllProviderWorkTypes();
        ShowProviderWorkTypeDTO GetProviderWorkTypeById(int id);
        List<ShowProviderWorkTypeDTO> GetByProviderId(int providerId);
        ShowProviderWorkTypeDTO CreateProviderWorkType(CreateProviderWorkTypeDTO dto);
        bool DeleteProviderWorkType(int id);
    }
}