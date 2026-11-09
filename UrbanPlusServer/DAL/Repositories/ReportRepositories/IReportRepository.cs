using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.ReportRepositories
{
    public interface IReportRepository
    {
        List<Reports> GetAllReports();
        Reports? GetReportById(int id);
        Reports AddReport(Reports report);
        bool DeleteReport(int id);
        Reports? GetOwned(int id, int userId);
        List<Reports> GetByUser(int userId);
    }
}
