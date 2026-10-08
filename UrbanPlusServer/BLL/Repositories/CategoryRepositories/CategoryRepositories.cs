using AutoMapper;
using AutoMapper.QueryableExtensions;
using DAL;
using DTO.BadgeDTO;
using DTO.CategoryDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Repositories.CategoryRepositories
{
    public class CategoryRepositories:ICategoryRepositories
    {
        private readonly UrbanPlusContext _context;
        private readonly IMapper _mapper;

        public CategoryRepositories(UrbanPlusContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ShowCategoryDTO> GetAllCategories()
        {
            return _context.Categories
               .ProjectTo<ShowCategoryDTO>(_mapper.ConfigurationProvider)
               .ToList();
        }
        public ShowCategoryDTO CreateCategory(CreateCategoryDTO dto)
        {
            var categories = _mapper.Map<Categories>(dto);


            _context.Categories.Add(categories);
            _context.SaveChanges();

            var created = _context.Categories
                .First(r => r.CategoryId == categories.CategoryId);

            return _mapper.Map<ShowCategoryDTO>(created);
        }


        public ShowCategoryDTO? GetCategoryById(int id)
        {
            return _context.Categories
              .Where(c => c.CategoryId == id)
              .ProjectTo<ShowCategoryDTO>(_mapper.ConfigurationProvider)
              .FirstOrDefault();
        }


        public bool DeleteCategory(int id)
        {
            var categories = _context.Categories.Find(id);
            if (categories is null)
                return false;

            _context.Categories.Remove(categories);
            _context.SaveChanges();
            return true;
        }
    }
}

