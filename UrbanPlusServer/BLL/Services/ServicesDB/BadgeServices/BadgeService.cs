
using AutoMapper;
using BLL.Exceptions;
using BLL.Services.ServiceSupport.ImageServices;
using DAL.Entities;
using DAL.Repositories.BadgeRepositories;
using DTO.BadgeDTO;

namespace BLL.Services.ServicesDB.BadgeServices
{
    public class BadgeService : IBadgeService
    {
        private readonly IBadgeRepository _repository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public BadgeService(
            IBadgeRepository repository,
            IMapper mapper,
            IImageService imageService)
        {
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
        }

        public List<ShowBadgeDTO> GetAllBadges()
        {
            var badges = _repository.GetAllBadges();

            return _mapper.Map<List<ShowBadgeDTO>>(badges);
        }

        public ShowBadgeDTO GetBadgeById(int id)
        {
            if (id <= 0)
                throw new NotFoundException("Invalid badge ID.");

            var badge = _repository.GetBadgeById(id);

            if (badge == null)
                throw new NotFoundException(
                    $"Badge with id {id} was not found.");

            return _mapper.Map<ShowBadgeDTO>(badge);
        }

        public ShowBadgeDTO CreateBadge(CreateBadgeDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (dto.IconUrl == null || dto.IconUrl.Length == 0)
                throw new ArgumentException("Badge icon is required.");

            if (string.IsNullOrWhiteSpace(dto.BadgeName))
                throw new ArgumentException("Badge name is required.");

            if (string.IsNullOrWhiteSpace(dto.Description))
                throw new ArgumentException("Description is required.");

            string? savedImage = null;

            try
            {
                savedImage = _imageService.Save(dto.IconUrl);

                var badge = new Badges
                {
                    BadgeName = dto.BadgeName.Trim(),
                    Description = dto.Description.Trim(),
                    IconUrl = savedImage
                };

                var createdBadge = _repository.AddBadge(badge);

                return _mapper.Map<ShowBadgeDTO>(createdBadge);
            }
            catch
            {
                if (!string.IsNullOrWhiteSpace(savedImage))
                    _imageService.Delete(savedImage);

                throw;
            }
        }

        public ShowBadgeDTO UpdateBadge(int id, UpdateBadgeDTO dto)
        {
            if (id <= 0)
                throw new NotFoundException("Invalid badge ID.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.BadgeName))
                throw new ArgumentException("Badge name is required.");

            if (string.IsNullOrWhiteSpace(dto.Description))
                throw new ArgumentException("Description is required.");

            var existingBadge = _repository.GetBadgeById(id);

            if (existingBadge == null)
                throw new NotFoundException(
                    $"Badge with id {id} was not found.");

            var oldImage = existingBadge.IconUrl;
            string? newImage = null;

            try
            {
                if (dto.IconUrl != null && dto.IconUrl.Length > 0)
                {
                    newImage = _imageService.Save(dto.IconUrl);
                    existingBadge.IconUrl = newImage;
                }

                existingBadge.BadgeName = dto.BadgeName.Trim();
                existingBadge.Description = dto.Description.Trim();

                var updated = _repository.UpdateBadge(existingBadge);

                if (!updated)
                    throw new NotFoundException(
                        $"Badge with id {id} was not found.");

                // מחיקת האייקון הישן רק לאחר שהעדכון הצליח
                if (newImage != null &&
                    !string.IsNullOrWhiteSpace(oldImage))
                {
                    _imageService.Delete(oldImage);
                }

                return _mapper.Map<ShowBadgeDTO>(existingBadge);
            }
            catch
            {
                // במקרה של כישלון, מוחקים את התמונה החדשה
                if (!string.IsNullOrWhiteSpace(newImage))
                    _imageService.Delete(newImage);

                throw;
            }
        }

        public bool DeleteBadge(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteBadge(id);
        }
    }
}
