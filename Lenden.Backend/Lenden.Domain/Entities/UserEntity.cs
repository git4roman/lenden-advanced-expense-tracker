using Lenden.Domain.ValueObject;
using NUlid;

namespace Lenden.Domain.Entities;

public class UserEntity
{
    private UserEntity() { }
    
    public Guid Id { get; private set; } 

    public Email Email { get; private set; }
    public string PasswordHash { get; private set; }

    public bool EmailVerified { get; private set; }
    public UserStatus Status { get; private set; }

    public Guid UserInfoId { get; private set; }

    private readonly List<UserSessionEntity> _sessions = new();
    public IReadOnlyCollection<UserSessionEntity> Sessions => _sessions.AsReadOnly();

    
    private static string GeneratePublicId()
    {
        return $"usr_{Ulid.NewUlid()}";
    }

    public UserEntity(Email email, string passwordHash)
    {
        Id = Guid.NewGuid();
        Email = email;
        PasswordHash = passwordHash;
        Status = UserStatus.Active;
    }

    public void LinkUserInfo(Guid userInfoId)
    {
        UserInfoId = userInfoId;
    }
}
