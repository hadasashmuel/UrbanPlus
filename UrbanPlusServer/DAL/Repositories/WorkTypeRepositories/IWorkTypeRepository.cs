using DAL.Entities;

namespace DAL.Repositories.WorkTypeRepositories
{
    public interface IWorkTypeRepository
    {
        List<WorkTypes> GetAllWorkTypes();
        WorkTypes? GetWorkTypeById(int id);
        List<WorkTypes> GetWorkTypesByCategoryId(int categoryId);
        WorkTypes AddWorkType(WorkTypes workType);
        bool UpdateWorkType(WorkTypes workType);
    }
}