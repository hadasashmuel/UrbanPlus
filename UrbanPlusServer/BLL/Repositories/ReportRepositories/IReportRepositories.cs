using DTO.MessageDTO;
using DTO.ReportDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.ReportRepositories
{
    public interface IReportRepositories
    {
        List<ShowReportDTO> GetAllReport();
        ShowReportDTO? GetReportById(int id);
        ShowReportDTO CreateReport(CreateReportDTO dto);
        bool DeleteReport(int id);
    }
}
