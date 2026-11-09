using DAL.Entities;

namespace DAL.Repositories.MessageRepositories
{
    public interface IMessageRepository
    {
        List<Message> GetAllMessages();
        Message? GetMessageById(int id);
        Message AddMessage(Message message);
        bool DeleteMessage(int id);
        Message? GetOwned(int id, int userId);
        List<Message> GetByUser(int userId);
    }
}
