namespace Lenden.Application.DTOs.Group;


public class GroupsResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public List<GroupMembersSummary> Members { get; set; }
    public List<GroupMembersBalanceResponseDto> Balances { get; set; }
    public int MemberCount { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}


public class GroupMembersSummary
{
    public Guid Id { get; set; }
    public string GivenName { get; set; }
    public string FamilyName { get; set; }
    public string ImageUrl { get; set; }
}



