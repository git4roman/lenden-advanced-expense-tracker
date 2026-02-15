namespace Lenden.Domain.Entities;

public class UserInfoEntity
{
    private UserInfoEntity() { }
    public UserInfoEntity(Guid userId, string firstName, string lastName)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        FirstName = firstName;
        LastName = lastName;
        CreatedAt = DateTime.UtcNow;
    }
    
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    public string FirstName { get; private set; }
    public string LastName { get; private set; }

    public string? PhoneNumber { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public void UpdateName(string first, string last)
    {
        FirstName = first;
        LastName = last;
    }
}
