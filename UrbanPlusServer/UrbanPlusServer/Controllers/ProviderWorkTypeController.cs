
using BLL.Services.ServicesDB.ProviderWorkTypeServices;
using DTO.ProviderWorkTypeDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProviderWorkTypeController : ControllerBase
    {
        private readonly IProviderWorkTypeService _providerWorkTypeService;

        public ProviderWorkTypeController(
            IProviderWorkTypeService providerWorkTypeService)
        {
            _providerWorkTypeService = providerWorkTypeService;
        }

        // GET: api/ProviderWorkType
        [HttpGet]
        public ActionResult<List<ShowProviderWorkTypeDTO>> GetAllProviderWorkTypes()
        {
            var providerWorkTypes =
                _providerWorkTypeService.GetAllProviderWorkTypes();

            return Ok(providerWorkTypes);
        }

        // GET: api/ProviderWorkType/5
        [HttpGet("{id}")]
        public ActionResult<ShowProviderWorkTypeDTO> GetProviderWorkTypeById(int id)
        {
            var providerWorkType =
                _providerWorkTypeService.GetProviderWorkTypeById(id);

            return Ok(providerWorkType);
        }

        // GET: api/ProviderWorkType/ByProvider/5
        [HttpGet("ByProvider/{providerId}")]
        public ActionResult<List<ShowProviderWorkTypeDTO>> GetByProviderId(
            int providerId)
        {
            var providerWorkTypes =
                _providerWorkTypeService.GetByProviderId(providerId);

            return Ok(providerWorkTypes);
        }

        // POST: api/ProviderWorkType
        [Authorize(Roles = "1")]
        [HttpPost]
        public ActionResult<ShowProviderWorkTypeDTO> CreateProviderWorkType(
            [FromBody] CreateProviderWorkTypeDTO dto)
        {
            var createdProviderWorkType =
                _providerWorkTypeService.CreateProviderWorkType(dto);

            return Ok(createdProviderWorkType);
        }

        // DELETE: api/ProviderWorkType/5
        [Authorize(Roles = "1")]
        [HttpDelete("{id}")]
        public IActionResult DeleteProviderWorkType(int id)
        {
            _providerWorkTypeService.DeleteProviderWorkType(id);

            return NoContent();
        }
    }
}
