
using BLL.Services.ServicesDB.AIChatServices;
using DTO.AIChatMessagesDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace UrbanPlusServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AIChatController : ControllerBase
    {
        private readonly IAIChatService _aiChatService;

        public AIChatController(IAIChatService aiChatService)
        {
            _aiChatService = aiChatService;
        }

        [HttpPost("send")]
        public async Task<ActionResult<AIChatMessageResponseDTO>> SendMessage(
            [FromBody] SendAIMessageDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var response = await _aiChatService.SendMessage(userId, dto);

            return Ok(response);
        }

        [HttpPost("stream")]
        public async Task StreamMessage(
            [FromBody] SendAIMessageDTO dto,
            CancellationToken cancellationToken)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(userIdClaim, out int userId))
            {
                Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }

            Response.StatusCode = StatusCodes.Status200OK;
            Response.ContentType = "text/event-stream";
            Response.Headers.CacheControl = "no-cache";
            Response.Headers.Append("X-Accel-Buffering", "no");

            var jsonOptions = new JsonSerializerOptions(
                JsonSerializerDefaults.Web);

            await foreach (var chunk in _aiChatService.StreamMessage(
                userId,
                dto,
                cancellationToken))
            {
                var json = JsonSerializer.Serialize(chunk, jsonOptions);

                await Response.WriteAsync(
                    $"data: {json}\n\n",
                    cancellationToken);

                await Response.Body.FlushAsync(cancellationToken);
            }

            await Response.WriteAsync(
                "data: [DONE]\n\n",
                cancellationToken);

            await Response.Body.FlushAsync(cancellationToken);
        }
    }
}
