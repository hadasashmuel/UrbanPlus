using AutoMapper;
using AutoMapper.QueryableExtensions;
using BLL.Repositories.CategoryRepositories;
using DAL;
using DTO.MessageDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.MessageRepositories
{
    public class MessageRepositories : IMessageRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public MessageRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowMessageDTO> GetAllMessages()
        {
            return _context.Messages
               .ProjectTo<ShowMessageDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowMessageDTO CreateMessage(CreateMessageDTO dto)
        {
            var message = _mapper.Map<Message>(dto);


            _context.Messages.Add(message);
            _context.SaveChanges();

            var created = _context.Messages
                .First(r => r.MessageId == message.MessageId);

            return _mapper.Map<ShowMessageDTO>(created);
        }


        public ShowMessageDTO? GetMessageById(int id)
        {
            return _context.Messages
              .Where(c => c.MessageId == id)
              .ProjectTo<ShowMessageDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteMessage(int id)
        {
            var message = _context.Messages.Find(id);
            if (message is null)
                return false;

            _context.Messages.Remove(message);
            _context.SaveChanges();
            return true;
        }
    }
}
