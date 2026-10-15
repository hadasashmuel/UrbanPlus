using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.MessageRepositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly UrbanPlusContext _context;

        public MessageRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Message> GetAllMessages()
        {
            return _context.Messages.AsNoTracking().Where(m => !m.IsDeleted).ToList();
        }

        public Message? GetMessageById(int id)
        {
            return _context.Messages .AsNoTracking().FirstOrDefault(m => m.MessageId == id && !m.IsDeleted);
        }

        public Message AddMessage(Message message)
        {
            _context.Messages.Add(message);
            _context.SaveChanges();

            return message;
        }

        public bool DeleteMessage(int id)
        {
            var message = _context.Messages
                .FirstOrDefault(m =>
                    m.MessageId == id && !m.IsDeleted);

            if (message == null)
                return false;

            message.IsDeleted = true;

            _context.SaveChanges();

            return true;
        }
    }
}
