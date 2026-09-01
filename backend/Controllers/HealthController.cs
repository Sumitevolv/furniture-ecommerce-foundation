using Microsoft.AspNetCore.Mvc;

namespace FurnitureShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        status = "ok",
        timestampUtc = DateTime.UtcNow,
        service = "FurnitureShop.Api",
    });
}
