
using AutoMapper;
using DAL.Entities;
using DAL.Repositories.ReportImageRepositories;
using DTO.ReportImageDTO;

namespace BLL.Services.ServicesDB.ReportImagesServices
{
    public class ReportImageService : IReportImageService
    {
        private readonly IReportImageRepository _repository;
        private readonly IMapper _mapper;

        public ReportImageService(
            IReportImageRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowReportImageDTO> GetAllReportImages()
        {
            var images = _repository.GetAllReportImages();
            return _mapper.Map<List<ShowReportImageDTO>>(images);
        }

        public ShowReportImageDTO? GetReportImageById(int id)
        {
            if (id <= 0)
                return null;

            var image = _repository.GetReportImageById(id);

            if (image == null)
                return null;

            return _mapper.Map<ShowReportImageDTO>(image);
        }

        public List<ShowReportImageDTO> GetImagesByReportId(int reportId)
        {
            if (reportId <= 0)
                return new List<ShowReportImageDTO>();

            var images = _repository.GetImagesByReportId(reportId);
            return _mapper.Map<List<ShowReportImageDTO>>(images);
        }

        public ShowReportImageDTO CreateReportImage(CreateReportImageDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (dto.ReportId <= 0)
                throw new ArgumentException("ReportId must be greater than zero.");

            if (dto.ImageUrl == null || dto.ImageUrl.Length == 0)
                throw new ArgumentException("ImageUrl is required.");

            if (dto.ImageUrl.Length > 2048)
                throw new ArgumentException("ImageUrl is too long.");

            var image = _mapper.Map<ReportImages>(dto);

            var savedImage = _repository.AddReportImage(image);

            return _mapper.Map<ShowReportImageDTO>(savedImage);
        }

        public bool DeleteReportImage(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteReportImage(id);
        }
    }
}
