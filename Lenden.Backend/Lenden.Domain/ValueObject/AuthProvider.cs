namespace Lenden.Domain.ValueObject;

public class AuthProvider
{
    public int Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Provider { get; private set; }  
    public string ProviderUserId { get; private set; }
    public DateTimeOffset LinkedAt { get; private set; }

    protected AuthProvider() { }

    public AuthProvider(string provider, string providerUserId)
    {
        Provider = provider;
        ProviderUserId = providerUserId;
        LinkedAt = DateTimeOffset.UtcNow;
    }
    public void LinkToUser(Guid userId)
    {
        UserId = userId;
    }
}