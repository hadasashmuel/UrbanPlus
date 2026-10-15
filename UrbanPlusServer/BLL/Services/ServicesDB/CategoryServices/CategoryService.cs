using AutoMapper;
using DAL.Entities;
using DAL.Repositories.CategoryRepositories;
using DTO.CategoryDTO;

namespace BLL.Services.ServicesDB.CategoryServices
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowCategoryDTO> GetAllCategories()
        {
            var categories = _repository.GetAllCategories();

            return _mapper.Map<List<ShowCategoryDTO>>(categories);
        }

        public ShowCategoryDTO? GetCategoryById(int id)
        {
            if (id <= 0)
                return null;

            var category = _repository.GetCategoryById(id);

            if (category == null)
                return null;

            return _mapper.Map<ShowCategoryDTO>(category);
        }

        public ShowCategoryDTO CreateCategory(CreateCategoryDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.CategoryName))
                throw new ArgumentException("Category name is required.");

            if (dto.CategoryName.Length > 80)
                throw new ArgumentException("Category name cannot exceed 80 characters.");

            if (dto.CategoryDescription != null &&dto.CategoryDescription.Length > 200)
                throw new ArgumentException( "Category description cannot exceed 200 characters.");

            var category = _mapper.Map<Categories>(dto);

            var createdCategory = _repository.AddCategory(category);

            return _mapper.Map<ShowCategoryDTO>(createdCategory);
        }

        public bool DeleteCategory(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteCategory(id);
        }
    }
}
