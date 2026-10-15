
using AutoMapper;
using DAL.Entities;
using DAL.Repositories.BadgeRepositories;
using DTO.BadgeDTO;

namespace BLL.Services.ServicesDB.BadgeServices
{
    public class BadgeService : IBadgeService
    {
        private readonly IBadgeRepository _repository;
        private readonly IMapper _mapper;

        public BadgeService( IBadgeRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowBadgeDTO> GetAllBadges()
        {
            var badges = _repository.GetAllBadges();

            return _mapper.Map<List<ShowBadgeDTO>>(badges);
        }

        public ShowBadgeDTO? GetBadgeById(int id)
        {
            if (id <= 0)
                return null;

            var badge = _repository.GetBadgeById(id);

            if (badge == null)
                return null;

            return _mapper.Map<ShowBadgeDTO>(badge);
        }

        public ShowBadgeDTO CreateBadge(CreateBadgeDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.BadgeName))
                throw new ArgumentException("Badge name is required.");

            if (dto.BadgeName.Trim().Length > 80)
                throw new ArgumentException( "Badge name cannot exceed 80 characters.");

            if (dto.Description != null && dto.Description.Length > 200)
                throw new ArgumentException(  "Description cannot exceed 200 characters.");

            var badge = _mapper.Map<Badges>(dto);
            badge.BadgeName = dto.BadgeName.Trim();

            var createdBadge = _repository.AddBadge(badge);

            return _mapper.Map<ShowBadgeDTO>(createdBadge);
        }

        public bool DeleteBadge(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteBadge(id);
        }
    }
}
