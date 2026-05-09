namespace Lenden.Application.DTOs.Group;

public class GroupMembersBalanceResponseDto
{
    public string From { get; set; }
    public Guid FromUserId { get; set; }
    public string To { get; set; }
    public Guid ToUserId { get; set; }
    public decimal Amount { get; set; }
}