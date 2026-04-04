namespace Lenden.Application.DTOs;

public class UserResponseDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string FamilyName { get; set; }
    public string GivenName { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public DateTimeOffset MemberSince { get; set; }
}