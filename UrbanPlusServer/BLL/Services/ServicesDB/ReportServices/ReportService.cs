
using AutoMapper;
using Azure.Core;
using BLL.Services.ServiceSupport.ImageServices;
using BLL.Services.ServicesDB.UserBadgeServices;
using BLL.Services.ServiceSupport.EventAggregationServices;
using DAL.Entities;
using DAL.Repositories.ReportRepositories;
using DTO.ReportDTO;

namespace BLL.Services.ServicesDB.ReportServices
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IImageService _imageService;
        private readonly IUserBadgeService _userBadgeService;
        private readonly IMapper _mapper;
        private readonly IEventAggregationService _eventAggregationService;

        public ReportService(
            IReportRepository reportRepository,
            IMapper mapper,
            IImageService imageService,
            IEventAggregationService eventAggregationService,
            IUserBadgeService userBadgeService)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _imageService = imageService;
            _eventAggregationService = eventAggregationService;
            _userBadgeService = userBadgeService;
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

        public ShowReportDTO CreateReport(CreateReportDTO dto, int userId)
        {
            var report = _mapper.Map<Reports>(dto);

            report.UserId = userId;
            report.CreatedAt = DateTime.UtcNow;

            var savedImages = new List<string>();

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

                // בדיקת זכאות לתגים
                _userBadgeService.CheckAndAwardBadges(userId);

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
                // מחיקת תמונות במקרה של כישלון
                foreach (var imageUrl in savedImages)
                {
                    _imageService.Delete(imageUrl);
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
