namespace ElectroBuy.Application.DTOs.Auth;

public class AuthResponseDto
{
    public UserDto User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
}
