using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.ReportAssignmentRepositories
{
    public class ReportAssignmentRepository : IReportAssignmentRepository
    {
        private readonly UrbanPlusContext _context;

        public ReportAssignmentRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<ReportAssignments> GetAllAssignments()
        {
            return _context.ReportAssignments
                .AsNoTracking()
                .Include(a => a.Report)
                .Include(a => a.ServiceProvider)
                .Include(a => a.Manager)
                .ToList();
        }

        public ReportAssignments? GetCurrentAssignmentByReportId(int reportId)
        {
            return _context.ReportAssignments
                .AsNoTracking()
                .Include(a => a.ServiceProvider)
                .Include(a => a.Manager)
                .FirstOrDefault(a =>
                    a.ReportId == reportId && a.IsCurrent);
        }

        public List<ReportAssignments> GetAssignmentHistoryByReportId(int reportId)
        {
            return _context.ReportAssignments
                .AsNoTracking()
                .Include(a => a.ServiceProvider)
                .Include(a => a.Manager)
                .Where(a => a.ReportId == reportId)
                .OrderByDescending(a => a.AssignedAt)
                .ToList();
        }

        public ReportAssignments AssignProvider(ReportAssignments assignment)
        {
            var currentAssignment = _context.ReportAssignments
                .FirstOrDefault(a =>
                    a.ReportId == assignment.ReportId && a.IsCurrent);

            if (currentAssignment != null)
            {
                currentAssignment.IsCurrent = false;
            }

            assignment.AssignedAt = DateTime.UtcNow;
            assignment.IsCurrent = true;

            _context.ReportAssignments.Add(assignment);
            _context.SaveChanges();

            return assignment;
        }
    }
}