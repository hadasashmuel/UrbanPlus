
using AutoMapper;
using DAL.Entities;
using DAL.Repositories.ReportAssignmentRepositories;
using DAL.Repositories.ReportRepositories;
using DAL.Repositories.ServiceProviderRepositories;
using DAL.Repositories.UserRepositories;
using DAL.Repositories.WorkTypeRepositories;
using DAL.Repositories.ProviderWorkTypeRepositories;
using DTO.ReportAssignmentDTO;

namespace BLL.Services.ServicesDB.ReportAssignmentServices
{
    public class ReportAssignmentService : IReportAssignmentService
    {
        private readonly IReportAssignmentRepository _reportAssignmentRepository;
        private readonly IReportRepository _reportRepository;
        private readonly IServiceProviderRepository _serviceProviderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWorkTypeRepository _workTypeRepository;
        private readonly IProviderWorkTypeRepository _providerWorkTypeRepository;
        private readonly IMapper _mapper;

        public ReportAssignmentService(
            IReportAssignmentRepository reportAssignmentRepository,
            IReportRepository reportRepository,
            IServiceProviderRepository serviceProviderRepository,
            IUserRepository userRepository,
            IWorkTypeRepository workTypeRepository,
            IProviderWorkTypeRepository providerWorkTypeRepository,
            IMapper mapper)
        {
            _reportAssignmentRepository = reportAssignmentRepository;
            _reportRepository = reportRepository;
            _serviceProviderRepository = serviceProviderRepository;
            _userRepository = userRepository;
            _workTypeRepository = workTypeRepository;
            _providerWorkTypeRepository = providerWorkTypeRepository;
            _mapper = mapper;
        }

        public List<ShowReportAssignmentDTO> GetAllAssignments()
        {
            var assignments = _reportAssignmentRepository.GetAllAssignments();

            return _mapper.Map<List<ShowReportAssignmentDTO>>(assignments);
        }

        public ShowReportAssignmentDTO GetCurrentAssignmentByReportId(int reportId)
        {
            var assignment = _reportAssignmentRepository
                .GetCurrentAssignmentByReportId(reportId);

            if (assignment == null)
                throw new Exception("Current assignment not found");

            return _mapper.Map<ShowReportAssignmentDTO>(assignment);
        }

        public List<ShowReportAssignmentDTO> GetAssignmentHistoryByReportId(int reportId)
        {
            var report = _reportRepository.GetReportById(reportId);

            if (report == null)
                throw new Exception("Report not found");

            var assignments = _reportAssignmentRepository
                .GetAssignmentHistoryByReportId(reportId);

            return _mapper.Map<List<ShowReportAssignmentDTO>>(assignments);
        }

        public ShowReportAssignmentDTO AssignProvider(
            CreateReportAssignmentDTO dto,
            int managerId)
        {
            // Check that the manager exists and is an admin
            var manager = _userRepository.GetById(managerId);

            if (manager == null)
                throw new Exception("Manager not found");

            if (manager.RoleCode != 1)
                throw new Exception("Only admins can assign service providers");

            // Check that the report exists
            var report = _reportRepository.GetReportById(dto.ReportId);

            if (report == null)
                throw new Exception("Report not found");

            // Check that the provider exists and is active
            var provider = _serviceProviderRepository
                .GetServiceProviderById(dto.ProviderId);

            if (provider == null)
                throw new Exception("Service provider not found");

            if (!provider.IsActive)
                throw new Exception("Service provider is not active");

            // Get all work types belonging to the report's category
            var categoryWorkTypes = _workTypeRepository
                .GetWorkTypesByCategoryId(report.CategoryId);

            if (!categoryWorkTypes.Any())
                throw new Exception("No work types found for this report category");

            // Check that the provider handles at least one matching work type
            var providerWorkTypes = _providerWorkTypeRepository
                .GetByProviderId(dto.ProviderId);

            var categoryWorkTypeIds = categoryWorkTypes
                .Select(w => w.WorkTypeId)
                .ToHashSet();

            bool hasMatchingWorkType = providerWorkTypes
                .Any(p => categoryWorkTypeIds.Contains(p.WorkTypeId));

            if (!hasMatchingWorkType)
                throw new Exception(
                    "Service provider is not assigned to any work type in this report category");

            // Create the assignment
            var assignment = _mapper.Map<ReportAssignments>(dto);

            assignment.ManagerId = managerId;

            var createdAssignment = _reportAssignmentRepository
                .AssignProvider(assignment);

            // Reload the assignment so that its related names are available for mapping
            var result = _reportAssignmentRepository
                .GetCurrentAssignmentByReportId(dto.ReportId);

            if (result == null)
                throw new Exception("Assignment could not be retrieved");

            return _mapper.Map<ShowReportAssignmentDTO>(result);
        }
    }
}
