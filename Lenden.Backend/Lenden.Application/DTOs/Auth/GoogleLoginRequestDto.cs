namespace Lenden.Application.DTOs;

public class GoogleLoginRequestDto
{
    public string IdToken { get; set; }
    public string DeviceInfo { get; set; }
    public string IpAddress { get; set; }
}