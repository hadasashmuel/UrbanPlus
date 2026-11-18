
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
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                // Close previous current assignments
                var previousAssignments = _context.ReportAssignments
                    .Where(a => a.ReportId == assignment.ReportId
                             && a.IsCurrent)
                    .ToList();

                foreach (var previous in previousAssignments)
                {
                    previous.IsCurrent = false;
                }

                assignment.AssignedAt = DateTime.UtcNow;
                assignment.IsCurrent = true;

                _context.ReportAssignments.Add(assignment);
                _context.SaveChanges();

                transaction.Commit();

                return assignment;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public List<ReportAssignments> AssignProviderToReports(
            List<ReportAssignments> assignments)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var reportIds = assignments
                    .Select(a => a.ReportId)
                    .ToList();

                var previousAssignments = _context.ReportAssignments
                    .Where(a => reportIds.Contains(a.ReportId)
                             && a.IsCurrent)
                    .ToList();

                foreach (var previous in previousAssignments)
                {
                    previous.IsCurrent = false;
                }

                foreach (var assignment in assignments)
                {
                    assignment.AssignedAt = DateTime.UtcNow;
                    assignment.IsCurrent = true;

                    _context.ReportAssignments.Add(assignment);
                }

                _context.SaveChanges();

                transaction.Commit();

                return assignments;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}
