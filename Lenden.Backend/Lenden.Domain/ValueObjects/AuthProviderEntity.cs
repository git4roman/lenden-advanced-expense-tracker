namespace Lenden.Domain.ValueObjects;

public class AuthProviderEntity
{
    public int Id { get; private set; }
    public long UserId { get; private set; }
    public string Provider { get; private set; }  
    public string ProviderUserId { get; private set; }
    public DateTimeOffset LinkedAt { get; private set; }

    protected AuthProviderEntity() { }

    private AuthProviderEntity(long userId, string provider, string providerUserId)
    {
        UserId = userId;
        Provider = provider;
        ProviderUserId = providerUserId;
        LinkedAt = DateTimeOffset.UtcNow;
    }

    internal static AuthProviderEntity Create(long userId, string provider, string providerUserId)
    {
        return new AuthProviderEntity(userId, provider, providerUserId);
    }
    
}