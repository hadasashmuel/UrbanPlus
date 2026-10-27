
using AutoMapper;
using DAL.Entities;
using DAL.Repositories.MessageRepositories;
using DTO.MessageDTO;

namespace BLL.Services.ServicesDB.MessageServices
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _repository;
        private readonly IMapper _mapper;

        public MessageService(IMessageRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowMessageDTO> GetAllMessages()
        {
            var messages = _repository.GetAllMessages();

            return _mapper.Map<List<ShowMessageDTO>>(messages);
        }

        public ShowMessageDTO? GetMessageById(int id)
        {
            var message = _repository.GetMessageById(id);

            if (message == null)
                return null;

            return _mapper.Map<ShowMessageDTO>(message);
        }

        public ShowMessageDTO CreateMessage(CreateMessageDTO dto, int userId)
        {
            var message = _mapper.Map<Message>(dto);

            // מזהה השולח נקבע לפי המשתמש המחובר
            message.UserId = userId;

            message.CreatedAt = DateTime.UtcNow;
            message.IsDeleted = false;

            var createdMessage = _repository.AddMessage(message);

            return _mapper.Map<ShowMessageDTO>(createdMessage);
        }


        public bool DeleteMessage(int messageId, int userId)
        {
            var message = _repository.GetOwned(messageId, userId);

            if (message is null)
                return false;

            _repository.DeleteMessage(message.MessageId);
            return true;
        }
    }
}
