
using AutoMapper;
using BLL.Exceptions;
using DAL.Entities;
using DAL.Repositories.MainEventRepositories;
using DTO.MainEventDTO;

namespace BLL.Services.ServicesDB.MainEventServices
{
    public class MainEventService : IMainEventService
    {
        private readonly IMainEventRepository _repository;
        private readonly IMapper _mapper;

        public MainEventService(
            IMainEventRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowMainEventDTO> GetAllMainEvents()
        {
            var events = _repository.GetAllMainEvents();

            return _mapper.Map<List<ShowMainEventDTO>>(events);
        }

        public ShowMainEventDTO? GetMainEventById(int id)
        {
            if (id <= 0)
                return null;

            var mainEvent = _repository.GetMainEventById(id);

            if (mainEvent == null)
                throw new NotFoundException(
                    $"Main event with id {id} was not found.");

            return _mapper.Map<ShowMainEventDTO>(mainEvent);
        }

        public bool DeleteMainEvent(int id, string reason)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "Event ID must be greater than zero.");

            if (string.IsNullOrWhiteSpace(reason) ||
                reason.Trim().Length < 3)
            {
                throw new ArgumentException(
                    "A valid deletion reason is required.");
            }

            var mainEvent = _repository.GetMainEventById(id);

            if (mainEvent == null)
                throw new NotFoundException(
                    $"Main event with id {id} was not found.");

            return _repository.DeleteMainEvent(id);
        }
    }
}
