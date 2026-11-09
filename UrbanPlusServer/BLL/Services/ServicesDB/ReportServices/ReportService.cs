
using AutoMapper;
using BLL.Exceptions;
using BLL.Services.ServiceSupport.ImageServices;
using DAL.Entities;
using DAL.Repositories.CategoryRepositories;
using DAL.Repositories.ReportRepositories;
using DTO.ReportDTO;


namespace BLL.Services.ServicesDB.ReportServices
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public ReportService( IReportRepository reportRepository, IMapper mapper,IImageService imageService)
        {
            _reportRepository = reportRepository;
            _mapper = mapper;
            _imageService = imageService;
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
                throw new NotFoundException($"Report with id {id} was not found");

            return _mapper.Map<ShowReportDTO>(report);
        }

        public ShowReportDTO CreateReport(CreateReportDTO dto, int userId)
        {
            var report = _mapper.Map<Reports>(dto);

            report.UserId = userId;
            report.CreatedAt = DateTime.UtcNow;

            // שמירת נתיבי התמונות שנשמרו
            var savedImages = new List<string>();

            try
            {
                if (dto.ImageList != null)
                {
                    foreach (var imageDto in dto.ImageList)
                    {
                        if (imageDto.ImageUrl == null ||
                            imageDto.ImageUrl.Length == 0)
                        {
                            continue;
                        }

                        var imageUrl = _imageService.Save(imageDto.ImageUrl);

                        savedImages.Add(imageUrl);

                        report.Images.Add(new ReportImages
                        {
                            ImageUrl = imageUrl
                        });
                    }
                }

                var createdReport = _reportRepository.AddReport(report);

                return _mapper.Map<ShowReportDTO>(createdReport);
            }
            catch
            {
                // מחיקת התמונות שנשמרו אם יצירת הדיווח נכשלה
                foreach (var imageUrl in savedImages)
                {
                    _imageService.Delete(imageUrl);
                }

                throw;
            }
        }

        public bool DeleteReport(int reportId)
        {
            return _reportRepository.DeleteReport(reportId);
        }
    }
}
