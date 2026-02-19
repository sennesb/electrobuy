using ElectroBuy.Application.DTOs.Cart;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ILogger<CartController> _logger;

    public CartController(ICartService cartService, ILogger<CartController> logger)
    {
        _cartService = cartService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(CartDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCart()
    {
        try
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.GetCartAsync(userId);
            return Ok(cart);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取购物车发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpGet("count")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCartCount()
    {
        try
        {
            var userId = GetCurrentUserId();
            var count = await _cartService.GetCartItemCountAsync(userId);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取购物车数量发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(CartItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var item = await _cartService.AddToCartAsync(userId, dto);
            _logger.LogInformation("添加商品到购物车: UserId={UserId}, ProductId={ProductId}, Quantity={Quantity}", 
                userId, dto.ProductId, dto.Quantity);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("添加购物车失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "添加购物车发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CartItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateQuantity(Guid id, [FromBody] UpdateCartDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var item = await _cartService.UpdateQuantityAsync(userId, id, dto);
            
            if (item == null)
            {
                if (dto.Quantity == 0)
                {
                    _logger.LogInformation("购物车商品已移除: CartItemId={CartItemId}", id);
                    return Ok(new { message = "商品已从购物车移除" });
                }
                return NotFound(new { message = "购物车项不存在" });
            }

            _logger.LogInformation("更新购物车数量: CartItemId={CartItemId}, Quantity={Quantity}", id, dto.Quantity);
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("更新购物车失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "更新购物车发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveItem(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _cartService.RemoveItemAsync(userId, id);
            
            if (!result)
            {
                return NotFound(new { message = "购物车项不存在" });
            }

            _logger.LogInformation("移除购物车商品: CartItemId={CartItemId}", id);
            return Ok(new { message = "移除成功" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "移除购物车商品发生错误: {Id}", id);
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    [HttpDelete("clear")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ClearCart()
    {
        try
        {
            var userId = GetCurrentUserId();
            await _cartService.ClearCartAsync(userId);
            _logger.LogInformation("清空购物车: UserId={UserId}", userId);
            return Ok(new { message = "购物车已清空" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "清空购物车发生错误");
            return StatusCode(500, new { message = "服务器内部错误" });
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("无法获取用户信息");
        }
        return userId;
    }
}
