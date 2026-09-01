using FurnitureShop.Api.Authentication;
using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ICurrentUserService _currentUser;

    public ProductsController(IProductService productService, ICurrentUserService currentUser)
    {
        _productService = productService;
        _currentUser = currentUser;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] ProductFilterQuery filters, [FromQuery] PaginationParams pagination, CancellationToken ct)
    {
        var result = await _productService.SearchAsync(filters, pagination, ct);
        return Ok(ApiResponse<PaginatedResponse<ProductListItemDto>>.Ok(result));
    }

    [HttpGet("featured")]
    public async Task<IActionResult> Featured(CancellationToken ct)
    {
        var result = await _productService.GetFeaturedAsync(ct);
        return Ok(ApiResponse<List<ProductListItemDto>>.Ok(result));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug, CancellationToken ct)
    {
        var product = await _productService.GetBySlugAsync(slug, ct);
        return Ok(ApiResponse<ProductDto>.Ok(product));
    }

    [HttpGet("{id:guid}/reviews")]
    public async Task<IActionResult> GetReviews(Guid id, CancellationToken ct)
    {
        var reviews = await _productService.GetReviewsAsync(id, ct);
        return Ok(ApiResponse<List<ProductReviewDto>>.Ok(reviews));
    }

    [HttpPost("{id:guid}/reviews")]
    [Authorize]
    public async Task<IActionResult> AddReview(Guid id, [FromBody] CreateReviewRequest request, CancellationToken ct)
    {
        var review = await _productService.AddReviewAsync(id, _currentUser.UserId!.Value, request, ct);
        return CreatedAtAction(nameof(GetReviews), new { id }, ApiResponse<ProductReviewDto>.Ok(review, "Review submitted."));
    }

    // ---------------- Admin ----------------

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetBySlug), new { slug = product.Slug }, ApiResponse<ProductDto>.Ok(product, "Product created."));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.UpdateAsync(id, request, ct);
        return Ok(ApiResponse<ProductDto>.Ok(product, "Product updated."));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _productService.DeleteAsync(id, ct);
        return Ok(ApiResponse<object?>.Ok(null, "Product removed."));
    }
}
