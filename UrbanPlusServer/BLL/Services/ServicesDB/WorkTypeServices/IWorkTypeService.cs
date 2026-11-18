
using DTO.WorkTypeDTO;

namespace BLL.Services.ServicesDB.WorkTypeServices
{
    public interface IWorkTypeService
    {
        List<ShowWorkTypeDTO> GetAllWorkTypes();
        ShowWorkTypeDTO GetWorkTypeById(int id);
        List<ShowWorkTypeDTO> GetWorkTypesByCategoryId(int categoryId);
        ShowWorkTypeDTO CreateWorkType(CreateWorkTypeDTO dto);
        ShowWorkTypeDTO UpdateWorkType(UpdateWorkTypeDTO dto);
    }
}
