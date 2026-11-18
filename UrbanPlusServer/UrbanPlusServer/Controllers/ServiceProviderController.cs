
using BLL.Services.ServicesDB.ServiceProviderServices;
using DTO.ServiceProviderDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ServiceProviderController : ControllerBase
    {
        private readonly IServiceProviderService _serviceProviderService;

        public ServiceProviderController(
            IServiceProviderService serviceProviderService)
        {
            _serviceProviderService = serviceProviderService;
        }

        // GET: api/ServiceProvider
        [HttpGet]
        public ActionResult<List<ShowServiceProviderDTO>> GetAllServiceProviders()
        {
            var providers = _serviceProviderService.GetAllServiceProviders();
            return Ok(providers);
        }

        // GET: api/ServiceProvider/5
        [HttpGet("{id}")]
        public ActionResult<ShowServiceProviderDTO> GetServiceProviderById(int id)
        {
            var provider = _serviceProviderService.GetServiceProviderById(id);
            return Ok(provider);
        }

        // POST: api/ServiceProvider
        [Authorize(Roles = "1")]
        [HttpPost]
        public ActionResult<ShowServiceProviderDTO> CreateServiceProvider(
            [FromBody] CreateServiceProviderDTO dto)
        {
            var createdProvider = _serviceProviderService.CreateServiceProvider(dto);

            return CreatedAtAction(
                nameof(GetServiceProviderById),
                new { id = createdProvider.ProviderId },
                createdProvider);
        }
        [HttpGet("by-event/{eventId}")]
        public ActionResult<List<ShowServiceProviderDTO>> GetServiceProvidersForEvent(
          int eventId)
        {
            var providers =
                _serviceProviderService.GetServiceProvidersForEvent(eventId);

            if (providers == null)
                return NotFound("Event not found");

            return Ok(providers);
        }
        // PUT: api/ServiceProvider/5
        [Authorize(Roles = "1")]
        [HttpPut("{id}")]
        public ActionResult<ShowServiceProviderDTO> UpdateServiceProvider(
            int id,
            [FromBody] UpdateServiceProviderDTO dto)
        {
            // Make sure the ID in the URL matches the DTO
            if (id != dto.ProviderId)
                return BadRequest("Provider ID mismatch");

            var updatedProvider = _serviceProviderService.UpdateServiceProvider(dto);
            return Ok(updatedProvider);
        }
    }
}
