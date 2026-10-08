using DTO.MessageDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.MessageRepositories
{
    public interface IMessageRepositories
    {
        List<ShowMessageDTO> GetAllMessages();
        ShowMessageDTO? GetMessageById(int id);
        ShowMessageDTO CreateMessage(CreateMessageDTO dto);
        bool DeleteMessage(int id);
    }
}
