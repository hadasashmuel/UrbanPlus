using DTO.CategoryDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.CategoryRepositories
{
    public interface ICategoryRepositories
    {
        List<ShowCategoryDTO> GetAllCategories();
        ShowCategoryDTO? GetCategoryById(int id);
        ShowCategoryDTO CreateCategory(CreateCategoryDTO dto);
        bool DeleteCategory(int id);
    }
}
