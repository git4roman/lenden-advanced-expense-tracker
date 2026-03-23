using System.ComponentModel.DataAnnotations.Schema;

namespace Lenden.Domain.Entities;

// [Table("userinfos")]
public class UserInfoEntity
{
    private UserInfoEntity() { }
    public UserInfoEntity(long userId, string address, string phoneNumber, string imageUrl, DateTime dateOfBirth)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Address= address;
        PhoneNumber = phoneNumber;
        ImageUrl = imageUrl;
        DateOfBirth = dateOfBirth;
        CreatedAt = DateTime.UtcNow;
    }
    
    public Guid Id { get; private set; }
    public long UserId { get; private set; }
    public string? PhoneNumber { get; private set; }
    public string? Address { get; private set; }
    public string? ImageUrl { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public DateTime CreatedAt { get; private set; }
    
    public UserEntity User { get; private set; }
    public void UpdateAddress(string address)
    {
        Address = address;
    }
    public void UpdatePhoneNumber(string phoneNumber)
    {
        PhoneNumber = phoneNumber;
    }
    public void UpdateImageUrl(string imageUrl)
    {
        ImageUrl = imageUrl;
    }

    public void UpdateDateOfBirth(DateTime dateOfBirth)
    {
        DateOfBirth = dateOfBirth;
    }

    
}
