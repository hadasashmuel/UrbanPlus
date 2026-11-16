
using DTO.MainEventDTO;

namespace BLL.Services.ServicesDB.MainEventServices
{
    public interface IMainEventService
    {
        List<ShowMainEventDTO> GetAllMainEvents();

        ShowMainEventDTO? GetMainEventById(int id);

        bool UpdateMainEvent(int id, UpdateMainEventDTO dto);

        bool DeleteMainEvent(int id, string reason);
    }
}
