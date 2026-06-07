using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lenden.Application.DTOs.Expense
{
    public record DeleteExpenseRequest(Guid GroupPublicId, Guid ExpensePublicId);

}
