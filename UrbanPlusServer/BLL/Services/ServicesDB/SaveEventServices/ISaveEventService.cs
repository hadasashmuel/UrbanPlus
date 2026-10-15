using DTO.SaveEventDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.SaveEventServices
{
    public interface ISaveEventService
    {
        List<ShowSavedEventsDTO> GetAllSavedEvents();
        ShowSavedEventsDTO? GetSavedEventById(int id);
        ShowSavedEventsDTO CreateSavedEvent(CreateSaveEventDTO dto,int userId);
        bool DeleteSavedEvent(int id);
    }
}
