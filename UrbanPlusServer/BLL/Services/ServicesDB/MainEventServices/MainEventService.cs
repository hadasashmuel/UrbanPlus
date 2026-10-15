
using AutoMapper;
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
                return null;

            return _mapper.Map<ShowMainEventDTO>(mainEvent);
        }

        //public ShowMainEventDTO CreateMainEvent( CreateMainEventDTO dto)
        //{
        //    if (dto == null)
        //        throw new ArgumentNullException(nameof(dto));

        //    if (string.IsNullOrWhiteSpace(dto.Title))
        //        throw new ArgumentException(
        //            "Event title is required.");

        //    if (dto.Title.Length > 80)
        //        throw new ArgumentException(
        //            "Event title cannot exceed 80 characters.");

        //    if (dto.EstimatedResolutionMinutes < 0)
        //        throw new ArgumentException(
        //            "Estimated resolution time cannot be negative.");

        //    if (dto.Latitude < -90 || dto.Latitude > 90)
        //        throw new ArgumentException(
        //            "Latitude is invalid.");

        //    if (dto.Longitude < -180 || dto.Longitude > 180)
        //        throw new ArgumentException(
        //            "Longitude is invalid.");

        //    var mainEvent = _mapper.Map<MainEvents>(dto);

        //    mainEvent.CreatedAt = DateTime.UtcNow;

        //    var createdEvent =
        //        _repository.AddMainEvent(mainEvent);

        //    return _mapper.Map<ShowMainEventDTO>(createdEvent);
        //}

        //public bool UpdateMainEvent(int id, UpdateMainEventDTO dto)
        //{
        //    if (id <= 0 || dto == null)
        //        return false;

        //    var existingEvent =
        //        _repository.GetMainEventById(id);

        //    if (existingEvent == null)
        //        return false;

        //    if (string.IsNullOrWhiteSpace(dto.Title))
        //        return false;

        //    if (dto.Title.Length > 80)
        //        return false;

        //    if (dto.EstimatedResolutionMinutes < 0)
        //        return false;

        //    if (dto.Latitude < -90 || dto.Latitude > 90)
        //        return false;

        //    if (dto.Longitude < -180 || dto.Longitude > 180)
        //        return false;

        //    _mapper.Map(dto, existingEvent);

        //    existingEvent.MainEventsId = id;

        //    return _repository.UpdateMainEvent(existingEvent);
        //}

        public bool DeleteMainEvent(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteMainEvent(id);
        }
    }
}
