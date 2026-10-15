using DTO.ReportImageDTO;

namespace BLL.Services.ServicesDB.ReportImagesServices
{
    public interface IReportImageService
    {
        List<ShowReportImageDTO> GetAllReportImages();
        ShowReportImageDTO? GetReportImageById(int id);
        List<ShowReportImageDTO> GetImagesByReportId(int reportId);
        ShowReportImageDTO CreateReportImage(CreateReportImageDTO dto);
        bool DeleteReportImage(int id);
    }
}
