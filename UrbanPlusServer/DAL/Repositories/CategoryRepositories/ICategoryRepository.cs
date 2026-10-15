using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL.Repositories.CategoryRepositories
{
    public interface ICategoryRepository
    {
        List<Categories> GetAllCategories();
        Categories? GetCategoryById(int id);
        Categories AddCategory(Categories category);
        bool DeleteCategory(int id);
    }
}
