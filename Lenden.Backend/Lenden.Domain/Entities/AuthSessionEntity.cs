using System.Security.Cryptography;
using System.Text;

namespace Lenden.Domain.Entities;

public class AuthSessionEntity
{
    private AuthSessionEntity() { }
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    public string RefreshTokenHash { get; private set; }

    public string DeviceInfo { get; private set; }
    public string IpAddress { get; private set; }

    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }


    public AuthSessionEntity(Guid userId, string refreshToken,
        string deviceInfo, string ipAddress, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        RefreshTokenHash= HashToken(refreshToken);
        DeviceInfo = deviceInfo;
        IpAddress = ipAddress;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
    }

    public void Revoke()
    {
        RevokedAt = DateTime.UtcNow;
    }
    
    public static string HashToken(string token)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public bool IsActive()
        => RevokedAt == null && DateTime.UtcNow < ExpiresAt;
}
