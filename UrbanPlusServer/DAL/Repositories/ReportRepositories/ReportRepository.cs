using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.ReportRepositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly UrbanPlusContext _context;

        public ReportRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Reports> GetAllReports()
        {
            return _context.Reports
                .AsNoTracking()
                .Include(r => r.Category)
                .ToList();
        }

        public Reports? GetReportById(int id)
        {
            return _context.Reports
                .AsNoTracking()
                .Include(r => r.Category)
                .FirstOrDefault(r => r.ReportId == id);
        }

        public Reports AddReport(Reports report)
        {
            _context.Reports.Add(report);
            _context.SaveChanges();

            return report;
        }

        public bool DeleteReport(int id)
        {
            var report = _context.Reports.Find(id);

            if (report == null)
                return false;

            _context.Reports.Remove(report);
            _context.SaveChanges();

            return true;
        }

        public Reports? GetOwned(int id, int userId) =>
       _context.Reports.FirstOrDefault(r => r.ReportId == id && r.UserId == userId);

        public List<Reports> GetByUser(int userId) =>
            _context.Reports.Where(r => r.UserId == userId).ToList();
    }
}