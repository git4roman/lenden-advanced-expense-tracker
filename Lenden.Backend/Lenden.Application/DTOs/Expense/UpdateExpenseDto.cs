using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lenden.Application.DTOs.Expense
{
    public record UpdateExpenseRequest(
     Guid ExpensePublicId,
     Guid GroupPublicId,
     decimal TotalAmount,
     int Category,
     string? Description,
     string? ImageUrl,
     List<ExpenseParticipantDto> Users
 );
}
