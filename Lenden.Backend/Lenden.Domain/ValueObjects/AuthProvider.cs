namespace Lenden.Domain.ValueObjects;

public class AuthProvider
{
    public int Id { get; private set; }
    public long UserId { get; private set; }
    public string Provider { get; private set; }  
    public string ProviderUserId { get; private set; }
    public DateTimeOffset LinkedAt { get; private set; }

    protected AuthProvider() { }

    private AuthProvider(long userId, string provider, string providerUserId)
    {
        UserId = userId;
        Provider = provider;
        ProviderUserId = providerUserId;
        LinkedAt = DateTimeOffset.UtcNow;
    }

    internal void Create(long userId, string provider, string providerUserId)
    {
        new AuthProvider(userId, provider, providerUserId);
    }
    
}