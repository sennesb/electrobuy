using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ElectroBuy.Application.DTOs.Auth;
using ElectroBuy.Application.DTOs.Users;
using ElectroBuy.Application.Interfaces;
using ElectroBuy.Domain.Entities;
using ElectroBuy.Domain.Enums;
using ElectroBuy.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using AuthUserDto = ElectroBuy.Application.DTOs.Auth.UserDto;
using AdminUserDto = ElectroBuy.Application.DTOs.Users.UserDto;

namespace ElectroBuy.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly ElectroBuyDbContext _context;
    private readonly IConfiguration _configuration;

    public UserService(ElectroBuyDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await UserExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("该邮箱已被注册");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name?.Trim(),
            Company = dto.Company?.Trim(),
            Phone = dto.Phone?.Trim(),
            Role = Domain.Enums.UserRole.User,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        var expiration = GetTokenExpiration();

        return new AuthResponseDto
        {
            User = MapToAuthUserDto(user),
            Token = token,
            Expiration = expiration
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower().Trim());

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("邮箱或密码错误");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("账户已被禁用");
        }

        var token = GenerateJwtToken(user);
        var expiration = GetTokenExpiration();

        return new AuthResponseDto
        {
            User = MapToAuthUserDto(user),
            Token = token,
            Expiration = expiration
        };
    }

    public async Task<AuthUserDto?> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users.FindAsync(userId);
        return user != null ? MapToAuthUserDto(user) : null;
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email.ToLower() == email.ToLower().Trim());
    }

    public async Task<AuthUserDto> UpdateUserAsync(Guid userId, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("用户不存在");
        }

        if (dto.Name != null)
            user.Name = dto.Name.Trim();
        if (dto.Company != null)
            user.Company = dto.Company.Trim();
        if (dto.Phone != null)
            user.Phone = dto.Phone.Trim();

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToAuthUserDto(user);
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            throw new InvalidOperationException("用户不存在");
        }

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("当前密码错误");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<UserListDto> GetUsersAsync(UserQueryDto query)
    {
        var queryable = _context.Users
            .Include(u => u.Orders)
            .AsQueryable();

        if (!string.IsNullOrEmpty(query.Keyword))
        {
            var keyword = query.Keyword.ToLower().Trim();
            queryable = queryable.Where(u =>
                u.Email.ToLower().Contains(keyword) ||
                (u.Name != null && u.Name.ToLower().Contains(keyword)) ||
                (u.Company != null && u.Company.ToLower().Contains(keyword)) ||
                (u.Phone != null && u.Phone.Contains(keyword))
            );
        }

        if (!string.IsNullOrEmpty(query.Role))
        {
            if (Enum.TryParse<UserRole>(query.Role, out var role))
            {
                queryable = queryable.Where(u => u.Role == role);
            }
        }

        if (query.IsActive.HasValue)
        {
            queryable = queryable.Where(u => u.IsActive == query.IsActive.Value);
        }

        var total = await queryable.CountAsync();

        var pageSize = Math.Min(Math.Max(query.PageSize, 1), 100);
        var totalPages = (int)Math.Ceiling(total / (double)pageSize);

        var users = await queryable
            .OrderByDescending(u => u.CreatedAt)
            .Skip((query.Page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new AdminUserDto
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Company = u.Company,
                Phone = u.Phone,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                OrderCount = u.Orders.Count
            })
            .ToListAsync();

        return new UserListDto
        {
            Data = users,
            Total = total,
            Page = query.Page,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    public async Task<AdminUserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _context.Users
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return null;

        return new AdminUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Company = user.Company,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            OrderCount = user.Orders.Count
        };
    }

    public async Task<AdminUserDto> UpdateUserByAdminAsync(Guid id, UpdateUserByAdminDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("用户不存在");
        }

        if (dto.Name != null)
            user.Name = dto.Name.Trim();
        if (dto.Company != null)
            user.Company = dto.Company.Trim();
        if (dto.Phone != null)
            user.Phone = dto.Phone.Trim();

        if (Enum.TryParse<UserRole>(dto.Role, out var role))
        {
            user.Role = role;
        }

        user.IsActive = dto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return (await GetUserByIdAsync(id))!;
    }

    public async Task<bool> ResetPasswordAsync(Guid id, ResetPasswordDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("用户不存在");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ToggleUserStatusAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            throw new InvalidOperationException("用户不存在");
        }

        user.IsActive = !user.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return user.IsActive;
    }

    public async Task<int> GetUserCountAsync()
    {
        return await _context.Users.CountAsync();
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expirationInMinutes = int.Parse(jwtSettings["ExpirationInMinutes"] ?? "120");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private DateTime GetTokenExpiration()
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationInMinutes = int.Parse(jwtSettings["ExpirationInMinutes"] ?? "120");
        return DateTime.UtcNow.AddMinutes(expirationInMinutes);
    }

    private static AuthUserDto MapToAuthUserDto(User user)
    {
        return new AuthUserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Company = user.Company,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}
