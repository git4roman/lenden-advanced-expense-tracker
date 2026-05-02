namespace Lenden.Application.DTOs.Group;


public class GroupsResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public List<string> MemberImgUrls { get; set; }
    public int MemberCount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}



