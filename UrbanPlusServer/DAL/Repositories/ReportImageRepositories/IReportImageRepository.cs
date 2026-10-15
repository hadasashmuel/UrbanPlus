using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.ReportImageRepositories
{
    public interface IReportImageRepository
    {
        List<ReportImages> GetAllReportImages();
        ReportImages? GetReportImageById(int id);
        List<ReportImages> GetImagesByReportId(int reportId);
        ReportImages AddReportImage(ReportImages reportImage);
        bool DeleteReportImage(int id);
    }
}
