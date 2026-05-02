namespace Lenden.Application.DTOs.Group;

public class GroupResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public List<GroupMemberDto> Members { get; set; }
}

public class GroupMemberDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string ImgUrl { get; set; }
    public string GivenName { get; set; }
    public string FamilyName { get; set; }
    public decimal NetBalance { get; set; }
}