
using DTO.SaveEventDTO;

namespace BLL.Services.ServicesDB.SaveEventServices
{
    public interface ISaveEventService
    {
        List<ShowSavedEventsDTO> GetSavedEventsByUserId(int userId);

        ShowSavedEventsDTO? GetSavedEventById(int id, int userId);

        ShowSavedEventsDTO CreateSavedEvent(CreateSaveEventDTO dto, int userId);

        bool DeleteSavedEvent(int id, int userId);
    }
}
