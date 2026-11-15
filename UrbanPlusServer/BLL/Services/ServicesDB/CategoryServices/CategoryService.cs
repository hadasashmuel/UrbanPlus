
using AutoMapper;
using BLL.Exceptions;
using DAL.Entities;
using DAL.Repositories.CategoryRepositories;
using DTO.CategoryDTO;

namespace BLL.Services.ServicesDB.CategoryServices
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public List<ShowCategoryDTO> GetAllCategories()
        {
            var categories = _repository.GetAllCategories();

            return _mapper.Map<List<ShowCategoryDTO>>(categories);
        }

        public ShowCategoryDTO GetCategoryById(int id)
        {
            if (id <= 0)
                throw new NotFoundException("Invalid category ID.");

            var category = _repository.GetCategoryById(id);

            if (category == null)
                throw new NotFoundException($"Category with id {id} was not found.");

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

            if (dto.CategoryDescription != null &&
                dto.CategoryDescription.Length > 200)
                throw new ArgumentException("Category description cannot exceed 200 characters.");

            var category = _mapper.Map<Categories>(dto);

            var createdCategory = _repository.AddCategory(category);

            return _mapper.Map<ShowCategoryDTO>(createdCategory);
        }

        public ShowCategoryDTO UpdateCategory(int id, UpdateCategoryDTO dto)
        {
            if (id <= 0)
                throw new NotFoundException("Invalid category ID.");

            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            if (string.IsNullOrWhiteSpace(dto.CategoryName))
                throw new ArgumentException("Category name is required.");

            if (dto.CategoryName.Length < 2 || dto.CategoryName.Length > 50)
                throw new ArgumentException("Category name must be between 2 and 50 characters.");

            if (dto.CategoryDescription != null &&
                dto.CategoryDescription.Length > 250)
                throw new ArgumentException("Category description cannot exceed 250 characters.");

            var existingCategory = _repository.GetCategoryById(id);

            if (existingCategory == null)
                throw new NotFoundException($"Category with id {id} was not found.");

            existingCategory.CategoryName = dto.CategoryName.Trim();
            existingCategory.CategoryDescription = dto.CategoryDescription;

            var updated = _repository.UpdateCategory(existingCategory);

            if (!updated)
                throw new NotFoundException($"Category with id {id} was not found.");

            return _mapper.Map<ShowCategoryDTO>(existingCategory);
        }

        public bool DeleteCategory(int id)
        {
            if (id <= 0)
                return false;

            return _repository.DeleteCategory(id);
        }
    }
}
