using DTO.ReportAssignmentDTO;

namespace BLL.Services.ServicesDB.ReportAssignmentServices
{
    public interface IReportAssignmentService
    {
        List<ShowReportAssignmentDTO> GetAllAssignments();
        ShowReportAssignmentDTO GetCurrentAssignmentByReportId(int reportId);
        List<ShowReportAssignmentDTO> GetAssignmentHistoryByReportId(int reportId);
        ShowReportAssignmentDTO AssignProvider( CreateReportAssignmentDTO dto, int managerId);
    }
}