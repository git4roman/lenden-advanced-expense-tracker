using System.ComponentModel.DataAnnotations.Schema;

namespace Lenden.Domain.Entities;

// [Table("userinfos")]
public class UserInfoEntity
{
    private UserInfoEntity() { }
    public UserInfoEntity(UserEntity user,  string address, string phoneNumber, string imageUrl, DateTime dateOfBirth)
    {
        User = user;
        Address= address;
        PhoneNumber = phoneNumber;
        ImageUrl = imageUrl;
        DateOfBirth = dateOfBirth;
        CreatedAt = DateTime.UtcNow;
    }
    
    public Guid Id { get; private set; }
    public long UserId { get; private set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; private set; }
    public string? ImageUrl { get; private set; }
    public DateTime? DateOfBirth { get; private set; }
    public DateTime CreatedAt { get; private set; }
    
    public UserEntity User { get; private set; }
    
    public void UpdateUserInfo(string address, string phoneNumber, string imageUrl, DateTime dob )
    {
        Address = address;
        PhoneNumber = phoneNumber;
        ImageUrl = imageUrl;
        DateOfBirth = dob;
    }
    
    

    
}
