using DTO.ReportDTO;

namespace BLL.Services.ServicesDB.ReportServices
{
    public interface IReportService
    {
        List<ShowReportDTO> GetAllReports();
        ShowReportDTO GetReportById(int id);
        ShowReportDTO CreateReport(CreateReportDTO dto, int userId);
        bool DeleteReport(int reportId);

        List<ShowReportDTO> GetReportsByUser(int userId);
    }
}