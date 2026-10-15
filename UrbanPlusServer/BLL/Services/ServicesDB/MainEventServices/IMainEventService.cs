using DTO.MainEventDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServicesDB.MainEventServices
{
    public interface IMainEventService
    {
        List<ShowMainEventDTO> GetAllMainEvents();
        ShowMainEventDTO? GetMainEventById(int id);
       // ShowMainEventDTO CreateMainEvent(CreateMainEventDTO dto);

       // bool UpdateMainEvent(int id,UpdateMainEventDTO dto);
        bool DeleteMainEvent(int id);
    }
}
