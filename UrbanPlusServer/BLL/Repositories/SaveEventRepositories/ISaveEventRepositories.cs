using DTO.ReportDTO;
using DTO.SaveEventDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.SaveEventRepositories
{
    public interface ISaveEventRepositories
    {
        List<ShowSavedEventsDTO> GetAllSavedEvents();
        ShowSavedEventsDTO? GetSavedEventById(int id);
        ShowSavedEventsDTO CreateSavedEvent(CreateSaveEventDTO dto);
        bool DeleteSavedEvent(int id);
    }
}
