using DAL.Entities;

namespace DAL.Repositories.CategoryRepositories
{
    public interface ICategoryRepository
    {
        List<Categories> GetAllCategories();
        Categories? GetCategoryById(int id);
        Categories AddCategory(Categories category);
        bool UpdateCategory(Categories category);
        bool DeleteCategory(int id);
    }
}