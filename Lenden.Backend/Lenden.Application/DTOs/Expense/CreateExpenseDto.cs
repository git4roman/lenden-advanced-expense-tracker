using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lenden.Application.DTOs.Expense
{
    public record CreateExpenseRequest(
    decimal TotalAmount,
    Guid GroupPublicId,
    int Category,
    string? Description,
    string? Receipt,
    List<ExpenseParticipantDto> Users,
    DateTimeOffset Date
    );
}
