using ElectroBuy.Application.DTOs.Products;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ProductListDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetList([FromQuery] ProductQueryDto query)
    {
        try
        {
            var result = await _productService.GetListAsync(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取产品列表发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null)
            {
                return NotFound(new { message = "产品不存在" });
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取产品详情发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("brands")]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBrands()
    {
        try
        {
            var brands = await _productService.GetBrandsAsync();
            return Ok(brands);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取品牌列表发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var product = await _productService.CreateAsync(dto);
            _logger.LogInformation("产品创建成功: {Name}", dto.Name);
            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("产品创建失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建产品发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var product = await _productService.UpdateAsync(id, dto);
            if (product == null)
            {
                return NotFound(new { message = "产品不存在" });
            }

            _logger.LogInformation("产品更新成功: {Id}", id);
            return Ok(product);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("产品更新失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "更新产品发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var result = await _productService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "产品不存在" });
            }

            _logger.LogInformation("产品删除成功: {Id}", id);
            return Ok(new { message = "删除成功" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("产品删除失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "删除产品发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    private bool IsAdmin()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        return roleClaim == "Admin";
    }
}
