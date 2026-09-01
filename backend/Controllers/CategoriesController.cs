using FurnitureShop.Api.DTOs.Common;
using FurnitureShop.Api.DTOs.Products;
using FurnitureShop.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly IProductService _productService;

    public CategoriesController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var categories = await _productService.GetCategoriesAsync(ct);
        return Ok(ApiResponse<List<CategoryDto>>.Ok(categories));
    }
}
