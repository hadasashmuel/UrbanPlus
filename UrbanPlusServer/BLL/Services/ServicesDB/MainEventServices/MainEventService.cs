
using AutoMapper;
using BLL.Exceptions;
using BLL.Services.ServicesDB.NotificationServices;
using BLL.Services.ServiceSupport.EmailServices;
using DAL.Entities;
using DAL.Repositories.MainEventRepositories;
using DTO.MainEventDTO;

namespace BLL.Services.ServicesDB.MainEventServices
{
    public class MainEventService : IMainEventService
    {
        private readonly IMainEventRepository _repository;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly IEmailService _emailService;

        public MainEventService(
            IMainEventRepository repository,
            IMapper mapper,
            INotificationService notificationService,
            IEmailService emailService)
        {
            _repository = repository;
            _mapper = mapper;
            _notificationService = notificationService;
            _emailService = emailService;
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

        public async Task<bool> UpdateMainEvent(
            int id,
            UpdateMainEventDTO dto)
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

            var categoryName =
                _repository.GetCategoryName(dto.CategoryId);

            if (categoryName == null)
                throw new ArgumentException(
                    "The selected category does not exist.");

            // שמירת הסטטוס הקודם
            var previousStatus = mainEvent.Status;
            var newStatus = dto.Status;

            // בדיקה האם הסטטוס השתנה
            bool statusChanged = previousStatus != newStatus;

            // מעבר לטיפול
            if (newStatus == EventStatus.InTreatment &&
                previousStatus != EventStatus.InTreatment &&
                !mainEvent.StartedAt.HasValue)
            {
                mainEvent.StartedAt = DateTime.UtcNow;
            }

            // מעבר לטופל
            if (newStatus == EventStatus.Treated &&
                previousStatus != EventStatus.Treated)
            {
                var resolvedAt = DateTime.UtcNow;

                var startedAt =
                    mainEvent.StartedAt ?? mainEvent.CreatedAt;

                mainEvent.StartedAt ??= startedAt;
                mainEvent.ResolvedAt = resolvedAt;

                if (resolvedAt >= startedAt)
                {
                    mainEvent.ActualResolutionMinutes =
                        Math.Max(
                            1,
                            (int)Math.Ceiling(
                                (resolvedAt - startedAt).TotalMinutes));
                }
            }

            // עדכון פרטי האירוע
            mainEvent.CategoryId = dto.CategoryId;
            mainEvent.Title = dto.Title.Trim();
            mainEvent.Status = newStatus;
            mainEvent.Severity = dto.Severity;

            mainEvent.EstimatedResolutionMinutes =
                dto.EstimatedResolutionMinutes;

            // שמירת האירוע במסד הנתונים
            bool updated = _repository.UpdateMainEvent(mainEvent);

            if (!updated)
                return false;

            // שליחת התראות ומיילים רק כאשר הסטטוס השתנה
            if (statusChanged)
            {
                // שליפת כל המשתמשים שדיווחו על האירוע
                var reporters = mainEvent.Reports
                    .Where(r => r.User != null)
                    .GroupBy(r => r.UserId)
                    .Select(g => g.First().User!)
                    .ToList();

                // רשימת משתמשים ייחודיים להתראות
                var userIds = reporters
                    .Select(user => user.UserId)
                    .Distinct()
                    .ToList();

                // התראות בתוך המערכת
                if (userIds.Count > 0)
                {
                    await _notificationService.CreateEventStatusNotifications(
                        mainEvent.MainEventsId,
                        mainEvent.Title,
                        newStatus.ToString(),
                        userIds);
                }

                // שליחת מייל לכל מדווח שיש לו כתובת מייל
                foreach (var reporter in reporters)
                {
                    if (string.IsNullOrWhiteSpace(reporter.Email))
                        continue;

                    await _emailService.SendEventStatusEmailAsync(
                        reporter.Email,
                        reporter.FirstName,
                        mainEvent.Title,
                        newStatus.ToString());
                }
            }

            return true;
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
