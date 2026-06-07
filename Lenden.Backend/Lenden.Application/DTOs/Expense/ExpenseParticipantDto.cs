namespace Lenden.Application.DTOs;

public class ExpenseParticipantDto
{
    public Guid UserId { get; set; }
    public decimal PaidAmount{ get; set; }
    public decimal SplitAmount{ get; set; }
    public decimal NetAmount{ get; set; }
};