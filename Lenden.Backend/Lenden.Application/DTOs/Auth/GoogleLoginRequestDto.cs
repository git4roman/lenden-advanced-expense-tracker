namespace Lenden.Application.DTOs;

public class GoogleLoginRequestDto
{
    public string Uid { get; set; }
    public string Email { get; set; }
    public bool EmailVerified { get; set; }
    public string DisplayName { get; set; }
    public string GivenName { get; set; }
    public string? FamilyName { get; set; }
    public string? PhotoUrl { get; set; }
    public string Provider { get; set; }
    public bool IsNewUser { get; set; }
    
    public string? DeviceId { get; set; }
    public string? IpAddress { get; set; }
}