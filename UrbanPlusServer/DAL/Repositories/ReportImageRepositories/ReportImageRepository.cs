
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.ReportImageRepositories
{
    public class ReportImageRepository : IReportImageRepository
    {
        private readonly UrbanPlusContext _context;

        public ReportImageRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<ReportImages> GetAllReportImages()
        {
            return _context.ReportImages
                .AsNoTracking()
                .ToList();
        }

        public ReportImages? GetReportImageById(int id)
        {
            return _context.ReportImages
                .AsNoTracking()
                .FirstOrDefault(i => i.ReportImageId == id);
        }

        public List<ReportImages> GetImagesByReportId(int reportId)
        {
            return _context.ReportImages
                .AsNoTracking()
                .Where(i => i.ReportId == reportId)
                .ToList();
        }

        public ReportImages AddReportImage(ReportImages reportImage)
        {
            _context.ReportImages.Add(reportImage);
            _context.SaveChanges();

            return reportImage;
        }

        public bool DeleteReportImage(int id)
        {
            var image = _context.ReportImages
                .FirstOrDefault(i => i.ReportImageId == id);

            if (image == null)
                return false;

            _context.ReportImages.Remove(image);
            _context.SaveChanges();

            return true;
        }
    }
}
