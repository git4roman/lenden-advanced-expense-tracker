using Lenden.Domain.ValueObjects;
using NUlid;

namespace Lenden.Domain.Entities;

public class UserEntity
{
    private UserEntity() 
    {
        _sessions = new List<AuthSessionEntity>();
        _authProviders = new List<AuthProviderEntity>();
    }
    public UserEntity(Email email, string givenName, string familyName, string passwordHash=null)
    {
        Email = email;
        PasswordHash = passwordHash;
        Status = UserStatus.Active;
        EmailVerified = false;
        _sessions = new List<AuthSessionEntity>();
        _authProviders = new List<AuthProviderEntity>();
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = DateTimeOffset.UtcNow;
        GivenName = givenName;
        FamilyName = familyName;
        Role = UserRole.Customer;
        Username = GenerateUsername( givenName, familyName);

    }
    
    private static string GenerateUsername(string givenName, string familyName)
    {
        var baseName = (givenName + familyName)
            .ToLower()
            .Replace(" ", "");

        var suffix = Random.Shared.Next(1000, 9999);

        return $"{baseName}{suffix}";
    }
    
    public long Id { get; private set; } 
    public Guid Slug { get; private set; } = Guid.NewGuid();
    public Email Email { get; private set; }
    public string? PasswordHash { get; private set; }
    public string Username { get; private set; }
    public string GivenName { get; private set; }
    public string FamilyName { get; private set; }
    public UserRole Role { get; private set; }
    public UserInfoEntity? UserInfo { get; private set; }
    public bool EmailVerified { get; private set; }
    public UserStatus Status { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    private readonly List<AuthSessionEntity> _sessions ;
    public IReadOnlyCollection<AuthSessionEntity> Sessions => _sessions.AsReadOnly();
    
    private readonly List<AuthProviderEntity> _authProviders ;
    public IReadOnlyCollection<AuthProviderEntity> AuthProviders => _authProviders.AsReadOnly();
    
    
    
    public void AddGoogleProvider(string googleUid)
    {
        if (_authProviders.Any(a => a.Provider == "Google" && a.ProviderUserId == googleUid))
            return; 
        _authProviders.Add(AuthProviderEntity.Create(Id,"Google", googleUid));
        UpdatedAt = DateTimeOffset.UtcNow;
    }
    
    // public void LinkUserInfo(Guid userInfoId)
    // {
    //     UserInfoId = userInfoId;
    // }
    public void UserStatusChange(UserStatus status)
    {
        Status = status;
    }
    
    public void SetPassword(string passwordHash)
    {
        PasswordHash = passwordHash;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void ConfirmEmail()
    {
        EmailVerified = true;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void AddAuthSession(string refreshToken, string deviceInfo, string ipAddress, DateTime expiresAt)
    {
        var session = AuthSessionEntity.Create(Id,
            refreshToken,
            deviceInfo,
            ipAddress,
            expiresAt);
        _sessions.Add(session);
    }
    
    public void UpdateName(string firstName, string lastName)
    {
        FamilyName = lastName;
        GivenName = firstName;
    }
    
   public void UpdateUserInfo(string address, string phoneNumber, string imageUrl, DateTime dob )
    {
        UserInfo?.UpdateUserInfo(address, phoneNumber, imageUrl, dob);
        UpdatedAt = DateTimeOffset.UtcNow;
    }
   
    public void CreateUserInfo(string address, string phoneNumber, string imageUrl, DateTime dateOfBirth)
    {
        UserInfo = new UserInfoEntity(this, address, phoneNumber, imageUrl, dateOfBirth);
    }
   
   
    
    
}
