using AutoMapper;
using DAL.Entities;
using DAL.Repositories.SaveEventRepositories;
using DTO.SaveEventDTO;

namespace BLL.Services.ServicesDB.SaveEventServices
{
    public class SaveEventService : ISaveEventService
    {
        private readonly ISaveEventRepository _repository;
        private readonly IMapper _mapper;

        public SaveEventService(ISaveEventRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowSavedEventsDTO> GetAllSavedEvents()
        {
            var savedEvents = _repository.GetAll();

            return _mapper.Map<List<ShowSavedEventsDTO>>(savedEvents);
        }

        public ShowSavedEventsDTO? GetSavedEventById(int id)
        {
            var savedEvent = _repository.GetById(id);

            if (savedEvent == null)
                return null;

            return _mapper.Map<ShowSavedEventsDTO>(savedEvent);
        }

        public ShowSavedEventsDTO CreateSavedEvent(CreateSaveEventDTO dto,int userId)
        {
            var savedEvent = _mapper.Map<SavedEvents>(dto);

            savedEvent.UserId = userId;
            savedEvent.CreatedAt = DateTime.UtcNow;

            var created = _repository.Add(savedEvent);

            return _mapper.Map<ShowSavedEventsDTO>(created);
        }

        public bool DeleteSavedEvent(int id)
        {
            return _repository.Delete(id);
        }
    }
}
