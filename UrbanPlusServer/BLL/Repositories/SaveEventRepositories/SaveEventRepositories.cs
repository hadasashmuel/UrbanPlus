using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.SaveEventDTO;
using Microsoft.EntityFrameworkCore;

namespace BLL.Repositories.SaveEventRepositories
{
    public class SaveEventRepositories:ISaveEventRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public SaveEventRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowSavedEventsDTO> GetAllSavedEvents()
        {
            return _context.SavedEvents
               .ProjectTo<ShowSavedEventsDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowSavedEventsDTO CreateSavedEvent(CreateSaveEventDTO dto)
        {
            var savedEvents = _mapper.Map<DAL.SavedEvents>(dto);


            _context.SavedEvents.Add(savedEvents);
            _context.SaveChanges();

            var created = _context.SavedEvents
                .Include(r => r.User)
                .Include(r => r.MainEvent)
                .First(r => r.SavedEventId == savedEvents.SavedEventId);

            return _mapper.Map<ShowSavedEventsDTO>(created);
        }

        public ShowSavedEventsDTO? GetSavedEventById(int id)
        {
            return _context.SavedEvents
              .Where(c => c.SavedEventId == id)
              .ProjectTo<ShowSavedEventsDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteSavedEvent(int id)
        {
            var savedEvents = _context.SavedEvents.Find(id);
            if (savedEvents is null)
                return false;

            _context.SavedEvents.Remove(savedEvents);
            _context.SaveChanges();
            return true;
        }
    }
}
