using AutoMapper;
using DAL.Entities;
using DAL.Repositories.ReportRepositories;
using DTO.ReportDTO;

namespace BLL.Services.ServicesDB.ReportServices
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;
        private readonly IMapper _mapper;

        public ReportService(IReportRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowReportDTO> GetAllReports()
        {
            var reports = _repository.GetAllReports();

            return _mapper.Map<List<ShowReportDTO>>(reports);
        }

        public ShowReportDTO? GetReportById(int id)
        {
            var report = _repository.GetReportById(id);

            if (report == null)
                return null;

            return _mapper.Map<ShowReportDTO>(report);
        }

        public ShowReportDTO CreateReport(CreateReportDTO dto,int userId)
        {
            var report = _mapper.Map<Reports>(dto);

            report.UserId = userId;
            report.CreatedAt = DateTime.UtcNow;

            var createdReport = _repository.AddReport(report);

            return _mapper.Map<ShowReportDTO>(createdReport);
        }

        public bool DeleteReport(int id)
        {
            return _repository.DeleteReport(id);
        }
    }
}
