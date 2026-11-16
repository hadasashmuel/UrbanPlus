
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

        public bool UpdateMainEvent(int id, UpdateMainEventDTO dto)
        {
            if (id <= 0)
                throw new ArgumentException(
                    "Event ID must be greater than zero.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.Title) ||
                dto.Title.Trim().Length < 2 ||
                dto.Title.Trim().Length > 100)
            {
                throw new ArgumentException(
                    "Title must be between 2 and 100 characters.");
            }

            if (dto.EstimatedResolutionMinutes <= 0)
                throw new ArgumentException(
                    "Estimated resolution minutes must be greater than zero.");

            var mainEvent = _repository.GetMainEventById(id);

            if (mainEvent == null)
                throw new NotFoundException(
                    $"Main event with id {id} was not found.");

            var categoryName = _repository.GetCategoryName(dto.CategoryId);

            if (categoryName == null)
                throw new ArgumentException(
                    "The selected category does not exist.");

            // מעדכנים רק את השדות שהמנהל רשאי לשנות
            mainEvent.CategoryId = dto.CategoryId;
            mainEvent.Title = dto.Title.Trim();
            mainEvent.Status = dto.Status;
            mainEvent.Severity = dto.Severity;
            mainEvent.EstimatedResolutionMinutes =
                dto.EstimatedResolutionMinutes;

            return _repository.UpdateMainEvent(mainEvent);
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
