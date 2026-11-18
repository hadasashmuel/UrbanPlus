
using BLL.Services.ServicesDB.WorkTypeServices;
using DTO.WorkTypeDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkTypeController : ControllerBase
    {
        private readonly IWorkTypeService _workTypeService;

        public WorkTypeController(IWorkTypeService workTypeService)
        {
            _workTypeService = workTypeService;
        }

        // GET: api/WorkType
        [HttpGet]
        public ActionResult<List<ShowWorkTypeDTO>> GetAllWorkTypes()
        {
            var workTypes = _workTypeService.GetAllWorkTypes();
            return Ok(workTypes);
        }

        // GET: api/WorkType/5
        [HttpGet("{id}")]
        public ActionResult<ShowWorkTypeDTO> GetWorkTypeById(int id)
        {
            var workType = _workTypeService.GetWorkTypeById(id);
            return Ok(workType);
        }

        // GET: api/WorkType/ByCategory/5
        [HttpGet("ByCategory/{categoryId}")]
        public ActionResult<List<ShowWorkTypeDTO>> GetWorkTypesByCategoryId(
            int categoryId)
        {
            var workTypes = _workTypeService.GetWorkTypesByCategoryId(categoryId);
            return Ok(workTypes);
        }

        // POST: api/WorkType
        [Authorize(Roles = "1")]
        [HttpPost]
        public ActionResult<ShowWorkTypeDTO> CreateWorkType(
            [FromBody] CreateWorkTypeDTO dto)
        {
            var createdWorkType = _workTypeService.CreateWorkType(dto);

            return Ok(createdWorkType);
        }

        // PUT: api/WorkType/5
        [Authorize(Roles = "1")]
        [HttpPut("{id}")]
        public ActionResult<ShowWorkTypeDTO> UpdateWorkType(
            int id,
            [FromBody] UpdateWorkTypeDTO dto)
        {
            if (id != dto.WorkTypeId)
                return BadRequest("Work type ID mismatch");

            var updatedWorkType = _workTypeService.UpdateWorkType(dto);
            return Ok(updatedWorkType);
        }
    }
}
