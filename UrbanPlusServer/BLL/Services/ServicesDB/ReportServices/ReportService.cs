
using AutoMapper;
using BLL.Services.ServiceSupport.ImageServices;
using BLL.Services.ServiceSupport.EventAggregationServices;
using BLL.Services.ServiceSupport.EventChatServices;
using BLL.Services.ServicesDB.UserBadgeServices;
using BLL.Services.ServicesDB.MessageServices;
using DAL.Entities;
using DAL.Repositories.ReportRepositories;
using DTO.ReportDTO;
using DTO.MessageDTO;

namespace BLL.Services.ServicesDB.ReportServices
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IImageService _imageService;
        private readonly IUserBadgeService _userBadgeService;
        private readonly IMapper _mapper;
        private readonly IEventAggregationService _eventAggregationService;
        private readonly IMessageService _messageService;
        private readonly IEventChatNotifier _eventChatNotifier;

        public ReportService(
            IReportRepository reportRepository,
            IMapper mapper,
            IImageService imageService,
            IEventAggregationService eventAggregationService,
            IUserBadgeService userBadgeService,
            IMessageService messageService,
            IEventChatNotifier eventChatNotifier)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _imageService = imageService;
            _eventAggregationService = eventAggregationService;
            _userBadgeService = userBadgeService;
            _messageService = messageService;
            _eventChatNotifier = eventChatNotifier;
        }

        public List<ShowReportDTO> GetAllReports()
        {
            var reports = _reportRepository.GetAllReports();
            return _mapper.Map<List<ShowReportDTO>>(reports);
        }

        public ShowReportDTO GetReportById(int id)
        {
            var report = _reportRepository.GetReportById(id);

            if (report == null)
                throw new Exception("Report not found");

            return _mapper.Map<ShowReportDTO>(report);
        }

        public async Task<ShowReportDTO> CreateReport(
            CreateReportDTO dto, int userId)
        {
            var report = _mapper.Map<Reports>(dto);

            report.UserId = userId;
            report.CreatedAt = report.CreatedAt = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
    DateTime.UtcNow,
    "Israel Standard Time"
);

            var savedImages = new List<string>();
            bool reportSaved = false;

            try
            {
                // שמירת התמונות
                if (dto.ImageList != null)
                {
                    foreach (var imageFile in dto.ImageList)
                    {
                        if (imageFile == null || imageFile.Length == 0)
                            continue;

                        var imageUrl = _imageService.Save(imageFile);

                        savedImages.Add(imageUrl);

                        report.Images.Add(new ReportImages
                        {
                            ImageUrl = imageUrl
                        });
                    }
                }

                // מציאת אירוע ראשי מתאים או יצירת אירוע חדש
                var mainEvent =
                    _eventAggregationService.FindOrCreateMainEvent(report);

                // קישור הדיווח לאירוע הראשי
                report.MainEventId = mainEvent.MainEventsId;

                // שמירת הדיווח
                var createdReport = _reportRepository.AddReport(report);
                reportSaved = true;

                // בדיקת זכאות לתגים
                _userBadgeService.CheckAndAwardBadges(userId);

                // יצירת הודעה אוטומטית בצ'אט האירוע
                try
                {
                    string description = report.Description ?? string.Empty;

                    string messageContent = description.Length > 100
                        ? description.Substring(0, 100)
                        : description;

                    if (!string.IsNullOrWhiteSpace(messageContent))
                    {
                        var messageDto = new CreateMessageDTO
                        {
                            MainEventId = mainEvent.MainEventsId,
                            Content = messageContent
                        };

                        var createdMessage =
                            _messageService.CreateMessage(messageDto, userId);

                        // שליחת ההודעה בזמן אמת דרך SignalR
                        try
                        {
                            await _eventChatNotifier.BroadcastMessageAsync(
                                createdMessage);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(
                                "Failed to broadcast report message: " + ex);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(
                        "Failed to create report chat message: " + ex);
                }

                try
                {
                    return _mapper.Map<ShowReportDTO>(createdReport);
                }
                catch (AutoMapperMappingException ex)
                {
                    Console.WriteLine("FULL MAPPING ERROR:");
                    Console.WriteLine(ex.ToString());
                    throw;
                }
            }
            catch
            {
                // מחיקת תמונות רק אם הדיווח לא נשמר
                if (!reportSaved)
                {
                    foreach (var imageUrl in savedImages)
                    {
                        _imageService.Delete(imageUrl);
                    }
                }

                throw;
            }
        }

        public List<ShowReportDTO> GetReportsByUser(int userId)
        {
            var reports = _reportRepository.GetByUser(userId);

            return _mapper.Map<List<ShowReportDTO>>(reports);
        }

        public bool DeleteReport(int reportId)
        {
            return _reportRepository.DeleteReport(reportId);
        }
    }
}
