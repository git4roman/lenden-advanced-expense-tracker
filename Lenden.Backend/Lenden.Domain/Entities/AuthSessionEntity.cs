using System.Security.Cryptography;
using System.Text;

namespace Lenden.Domain.Entities;

public class AuthSessionEntity
{
    private AuthSessionEntity() { }
    public Guid Id { get; private set; }
    public long UserId { get; private set; }

    public string RefreshTokenHash { get; private set; }

    public string DeviceInfo { get; private set; }
    public string IpAddress { get; private set; }

    public DateTime ExpiresAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? RevokedAt { get; private set; }
    public DateTime? LastUsedAt { get; private set; }


    private AuthSessionEntity(long userId, string refreshToken,
        string deviceInfo, string ipAddress, DateTime expiresAt)
    {
        UserId = userId;
        RefreshTokenHash= HashToken(refreshToken);
        DeviceInfo = deviceInfo;
        IpAddress = ipAddress;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
    }

    internal static AuthSessionEntity Create(
        long userId,
        string refreshToken,
        string deviceInfo,
        string ipAddress,
        DateTime expiresAt)
    {
        return new AuthSessionEntity(
            userId,
            refreshToken,
            deviceInfo,
            ipAddress,
            expiresAt);
    }
    
    internal static AuthSessionEntity Revoke(AuthSessionEntity session)
    {
        session.Revoke();
        return session;
    }

    public void Revoke()
    {
        RevokedAt = DateTime.UtcNow;
    }
    
    public void RecordUsage(string currentIp)
    {
        LastUsedAt = DateTime.UtcNow;
        IpAddress = currentIp; 
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
