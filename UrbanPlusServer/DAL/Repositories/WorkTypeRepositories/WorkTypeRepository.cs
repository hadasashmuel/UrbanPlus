using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.WorkTypeRepositories
{
    public class WorkTypeRepository : IWorkTypeRepository
    {
        private readonly UrbanPlusContext _context;

        public WorkTypeRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<WorkTypes> GetAllWorkTypes()
        {
            return _context.WorkTypes
                .AsNoTracking()
                .Include(w => w.Category)
                .ToList();
        }

        public WorkTypes? GetWorkTypeById(int id)
        {
            return _context.WorkTypes
                .AsNoTracking()
                .Include(w => w.Category)
                .FirstOrDefault(w => w.WorkTypeId == id);
        }

        public List<WorkTypes> GetWorkTypesByCategoryId(int categoryId)
        {
            return _context.WorkTypes
                .AsNoTracking()
                .Include(w => w.Category)
                .Where(w => w.CategoryId == categoryId)
                .ToList();
        }

        public WorkTypes AddWorkType(WorkTypes workType)
        {
            _context.WorkTypes.Add(workType);
            _context.SaveChanges();

            return _context.WorkTypes
                .AsNoTracking()
                .Include(w => w.Category)
                .First(w => w.WorkTypeId == workType.WorkTypeId);
        }

        public bool UpdateWorkType(WorkTypes workType)
        {
            var existingWorkType = _context.WorkTypes
                .Find(workType.WorkTypeId);

            if (existingWorkType == null)
                return false;

            existingWorkType.CategoryId = workType.CategoryId;
            existingWorkType.NameWorkTypes = workType.NameWorkTypes;
            existingWorkType.Description = workType.Description;

            _context.SaveChanges();

            return true;
        }
    }
}