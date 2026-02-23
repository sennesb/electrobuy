using System.Security.Claims;
using ElectroBuy.Application.DTOs.Orders;
using ElectroBuy.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElectroBuy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpGet]
    [ProducesResponseType(typeof(OrderListDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrders([FromQuery] OrderQueryDto query)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var result = await _orderService.GetOrdersAsync(userId.Value, query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var order = await _orderService.GetOrderByIdAsync(userId.Value, id);
        if (order == null)
        {
            return NotFound(new { message = "订单不存在" });
        }

        return Ok(order);
    }

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        try
        {
            var order = await _orderService.CreateOrderAsync(userId.Value, dto);
            _logger.LogInformation("用户 {UserId} 创建订单成功: {OrderNumber}", userId, order.OrderNumber);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("创建订单失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/cancel")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        try
        {
            var order = await _orderService.CancelOrderAsync(userId.Value, id);
            if (order == null)
            {
                return NotFound(new { message = "订单不存在" });
            }

            _logger.LogInformation("用户 {UserId} 取消订单成功: {OrderId}", userId, id);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("取消订单失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/complete")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CompleteOrder(Guid id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        try
        {
            var order = await _orderService.CompleteOrderAsync(userId.Value, id);
            if (order == null)
            {
                return NotFound(new { message = "订单不存在" });
            }

            _logger.LogInformation("用户 {UserId} 确认收货成功: {OrderId}", userId, id);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("确认收货失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("count")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrderCount()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var count = await _orderService.GetOrderCountAsync(userId.Value);
        return Ok(count);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(OrderListDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllOrders([FromQuery] OrderQueryDto query)
    {
        var result = await _orderService.GetAllOrdersAsync(query);
        return Ok(result);
    }

    [HttpGet("admin/{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrderForAdmin(Guid id)
    {
        var order = await _orderService.GetOrderByIdForAdminAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "订单不存在" });
        }
        return Ok(order);
    }

    [HttpPost("admin/{id}/confirm")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmOrder(Guid id)
    {
        try
        {
            var order = await _orderService.ConfirmOrderAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "订单不存在" });
            }

            _logger.LogInformation("管理员确认订单成功: {OrderId}", id);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("确认订单失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("admin/{id}/ship")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ShipOrder(Guid id, [FromBody] ShipOrderDto? dto)
    {
        try
        {
            var order = await _orderService.ShipOrderAsync(id, dto?.TrackingNumber);
            if (order == null)
            {
                return NotFound(new { message = "订单不存在" });
            }

            _logger.LogInformation("管理员发货成功: {OrderId}", id);
            return Ok(order);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("发货失败: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("admin/export")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportOrders([FromQuery] OrderQueryDto query)
    {
        var csvBytes = await _orderService.ExportOrdersAsync(query);
        var fileName = $"orders_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv";
        return File(csvBytes, "text/csv", fileName);
    }

    [HttpPost("admin/batch-confirm")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    public async Task<IActionResult> BatchConfirmOrders([FromBody] BatchConfirmDto dto)
    {
        var count = await _orderService.BatchConfirmOrdersAsync(dto.OrderIds);
        _logger.LogInformation("批量确认订单成功: {Count} 个", count);
        return Ok(new { count, message = $"成功确认 {count} 个订单" });
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return null;
        }

        if (Guid.TryParse(userIdClaim, out var userId))
        {
            return userId;
        }

        return null;
    }
}
