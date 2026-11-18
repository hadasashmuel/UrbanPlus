using DAL.Entities;

namespace DAL.Repositories.ReportAssignmentRepositories
{
    public interface IReportAssignmentRepository
    {
        List<ReportAssignments> GetAllAssignments();
        ReportAssignments? GetCurrentAssignmentByReportId(int reportId);
        List<ReportAssignments> GetAssignmentHistoryByReportId(int reportId);
        ReportAssignments AssignProvider(ReportAssignments assignment);
    }
}