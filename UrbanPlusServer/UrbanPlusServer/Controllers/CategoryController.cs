
using BLL.Services.ServicesDB.CategoryServices;
using DTO.CategoryDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Category
        [AllowAnonymous]
        [HttpGet]
        public ActionResult<List<ShowCategoryDTO>> GetAllCategories()
        {
            var categories = _categoryService.GetAllCategories();

            return Ok(categories);
        }

        // GET: api/Category/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public ActionResult<ShowCategoryDTO> GetCategoryById(int id)
        {
            var category = _categoryService.GetCategoryById(id);

            return Ok(category);
        }

        // POST: api/Category
        [Authorize(Roles = "1")]
        [HttpPost]
        public ActionResult<ShowCategoryDTO> CreateCategory( [FromBody] CreateCategoryDTO dto)
        {
            var createdCategory = _categoryService.CreateCategory(dto);

            return CreatedAtAction(
                nameof(GetCategoryById),
                new { id = createdCategory.CategoryId },
                createdCategory);
        }

        // DELETE: api/Category/5
        [Authorize(Roles = "1")]
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            _categoryService.DeleteCategory(id);

            return NoContent();
        }
    }
}
