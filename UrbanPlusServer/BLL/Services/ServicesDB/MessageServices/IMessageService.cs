using DTO.MessageDTO;
namespace BLL.Services.ServicesDB.MessageServices
{
    public interface IMessageService
    {
        List<ShowMessageDTO> GetAllMessages();
        ShowMessageDTO? GetMessageById(int id);
        ShowMessageDTO CreateMessage(CreateMessageDTO dto);
        bool DeleteMessage(int id);
    }
}