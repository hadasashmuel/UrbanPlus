using DTO.CategoryDTO;

namespace BLL.Services.ServicesDB.CategoryServices
{
    public interface ICategoryService
    {
        List<ShowCategoryDTO> GetAllCategories();
        ShowCategoryDTO? GetCategoryById(int id);
        ShowCategoryDTO CreateCategory(CreateCategoryDTO dto);
        bool DeleteCategory(int id);
    }
}
