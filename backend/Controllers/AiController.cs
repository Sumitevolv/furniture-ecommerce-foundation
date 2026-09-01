using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Ai;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;
    private readonly ICurrentUserService _currentUser;

    public AiController(IAiService aiService, ICurrentUserService currentUser)
    {
        _aiService = aiService;
        _currentUser = currentUser;
    }

    /// <summary>Chat works for both guests and signed-in users; conversations are linked to a user when authenticated.</summary>
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest request, CancellationToken ct)
    {
        var response = await _aiService.ChatAsync(_currentUser.UserId, request, ct);
        return Ok(ApiResponse<AiChatResponseDto>.Ok(response));
    }

    [HttpPost("recommendations")]
    public async Task<IActionResult> Recommendations([FromBody] AiRecommendationRequest request, CancellationToken ct)
    {
        var response = await _aiService.GetRecommendationsAsync(request, ct);
        return Ok(ApiResponse<AiRecommendationResponseDto>.Ok(response));
    }

    [HttpPost("describe-image")]
    public async Task<IActionResult> DescribeImage([FromBody] DescribeImageRequest request, CancellationToken ct)
    {
        var response = await _aiService.DescribeImageAsync(request, ct);
        return Ok(ApiResponse<DescribeImageResponseDto>.Ok(response));
    }
}
