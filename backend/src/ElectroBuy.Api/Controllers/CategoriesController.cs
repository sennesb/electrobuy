using ElectroBuy.Application.DTOs.Categories;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
    {
        _categoryService = categoryService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CategoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取分类列表发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("tree")]
    [ProducesResponseType(typeof(IEnumerable<CategoryTreeDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTree()
    {
        try
        {
            var tree = await _categoryService.GetTreeAsync();
            return Ok(tree);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取分类树发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "分类不存在" });
            }
            return Ok(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取分类详情发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var category = await _categoryService.CreateAsync(dto);
            _logger.LogInformation("分类创建成功: {Name}", dto.Name);
            return Ok(category);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("分类创建失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建分类发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var category = await _categoryService.UpdateAsync(id, dto);
            if (category == null)
            {
                return NotFound(new { message = "分类不存在" });
            }

            _logger.LogInformation("分类更新成功: {Id}", id);
            return Ok(category);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("分类更新失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "更新分类发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            if (!IsAdmin())
            {
                return Forbid();
            }

            var result = await _categoryService.DeleteAsync(id);
            if (!result)
            {
                return NotFound(new { message = "分类不存在" });
            }

            _logger.LogInformation("分类删除成功: {Id}", id);
            return Ok(new { message = "删除成功" });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("分类删除失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "删除分类发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    private bool IsAdmin()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        return roleClaim == "Admin";
    }
}
