using Lenden.Domain.Entities;

namespace Lenden.Application.DTOs;

public class UserUpdateRequestDto
{
    public string GivenName { get;  set; }
    public string FamilyName { get;  set; }
    public string? PhoneNumber { get;  set; }
    public string? Address { get;  set; }
    public string? ImageUrl { get;  set; }
    public DateTime DateOfBirth { get;  set; }
    public UserEntity User { get; set; }
}