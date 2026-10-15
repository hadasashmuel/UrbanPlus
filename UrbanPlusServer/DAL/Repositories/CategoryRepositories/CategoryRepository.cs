
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories.CategoryRepositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly UrbanPlusContext _context;

        public CategoryRepository(UrbanPlusContext context)
        {
            _context = context;
        }

        public List<Categories> GetAllCategories()
        {
            return _context.Categories.AsNoTracking().ToList();
        }

        public Categories? GetCategoryById(int id)
        {
            return _context.Categories.AsNoTracking().FirstOrDefault(c => c.CategoryId == id);
        }

        public Categories AddCategory(Categories category)
        {
            _context.Categories.Add(category);
            _context.SaveChanges();

            return category;
        }

        public bool DeleteCategory(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.CategoryId == id);

            if (category == null)
                return false;

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return true;
        }
    }
}
