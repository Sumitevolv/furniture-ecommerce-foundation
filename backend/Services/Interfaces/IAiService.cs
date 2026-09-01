using FurnitureShop.Api.DTOs.Ai;

namespace FurnitureShop.Api.Services.Interfaces;

public interface IAiService
{
    Task<AiChatResponseDto> ChatAsync(Guid? userId, AiChatRequest request, CancellationToken ct = default);
    Task<AiRecommendationResponseDto> GetRecommendationsAsync(AiRecommendationRequest request, CancellationToken ct = default);
    Task<DescribeImageResponseDto> DescribeImageAsync(DescribeImageRequest request, CancellationToken ct = default);
}
