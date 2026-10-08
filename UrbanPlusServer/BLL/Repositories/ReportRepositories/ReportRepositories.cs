using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.MessageDTO;
using DTO.ReportDTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using static DTO.ReportDTO.ShowReportDTO;

namespace BLL.Repositories.ReportRepositories
{
    public class ReportRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public ReportRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowReportDTO> GetAllReports()
        {
            return _context.Reports
               .ProjectTo<ShowReportDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowReportDTO CreateReport(CreateReportDTO dto)
        {
            var report = _mapper.Map<DAL.Reports>(dto);


            _context.Reports.Add(report);
            _context.SaveChanges();

            var created = _context.Reports
                .Include(r => r.Category)
                .Include(r => r.User)
                .First(r => r.ReportId == report.ReportId);

            return _mapper.Map<ShowReportDTO>(created);
        }


        public ShowReportDTO? GetReportById(int id)
        {
            return _context.Reports
              .Where(c => c.ReportId == id)
              .ProjectTo<ShowReportDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteReport(int id)
        {
            var report = _context.Reports.Find(id);
            if (report is null)
                return false;

            _context.Reports.Remove(report);
            _context.SaveChanges();
            return true;
        }
    }
}
