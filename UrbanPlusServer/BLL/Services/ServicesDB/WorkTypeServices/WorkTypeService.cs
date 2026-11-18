using AutoMapper;
using DAL.Entities;
using DAL.Repositories.WorkTypeRepositories;
using DTO.WorkTypeDTO;

namespace BLL.Services.ServicesDB.WorkTypeServices
{
    public class WorkTypeService : IWorkTypeService
    {
        private readonly IWorkTypeRepository _workTypeRepository;
        private readonly IMapper _mapper;

        public WorkTypeService(
            IWorkTypeRepository workTypeRepository,
            IMapper mapper)
        {
            _workTypeRepository = workTypeRepository;
            _mapper = mapper;
        }

        public List<ShowWorkTypeDTO> GetAllWorkTypes()
        {
            var workTypes = _workTypeRepository.GetAllWorkTypes();

            return _mapper.Map<List<ShowWorkTypeDTO>>(workTypes);
        }

        public ShowWorkTypeDTO GetWorkTypeById(int id)
        {
            var workType = _workTypeRepository.GetWorkTypeById(id);

            if (workType == null)
                throw new Exception("Work type not found");

            return _mapper.Map<ShowWorkTypeDTO>(workType);
        }

        public List<ShowWorkTypeDTO> GetWorkTypesByCategoryId(int categoryId)
        {
            var workTypes =
                _workTypeRepository.GetWorkTypesByCategoryId(categoryId);

            return _mapper.Map<List<ShowWorkTypeDTO>>(workTypes);
        }

        public ShowWorkTypeDTO CreateWorkType(CreateWorkTypeDTO dto)
        {
            var workType = _mapper.Map<WorkTypes>(dto);

            var createdWorkType =
                _workTypeRepository.AddWorkType(workType);

            return _mapper.Map<ShowWorkTypeDTO>(createdWorkType);
        }

        public ShowWorkTypeDTO UpdateWorkType(UpdateWorkTypeDTO dto)
        {
            var workType = _mapper.Map<WorkTypes>(dto);

            var updated =
                _workTypeRepository.UpdateWorkType(workType);

            if (!updated)
                throw new Exception("Work type not found");

            // שליפת סוג העבודה המעודכן
            var updatedWorkType =
                _workTypeRepository.GetWorkTypeById(dto.WorkTypeId);

            return _mapper.Map<ShowWorkTypeDTO>(updatedWorkType);
        }
    }
}