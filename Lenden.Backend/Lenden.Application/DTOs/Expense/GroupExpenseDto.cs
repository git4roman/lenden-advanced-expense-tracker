using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lenden.Application.DTOs.Expense
{

    public class CreatedBy
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string GivenName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
    }

    public class Repayments
    {
        public Guid From { get; set; }
        public Guid To { get; set; }
        public decimal Amount { get; set; }

    }

    public class Users
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string GivenName { get; set; }
        public string FamilyName { get; set; }
        public string Avatar { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal SplitAmount { get; set; }
        public decimal NetBalance { get; set; }

    }
    public class GroupExpenseResponseDto
    {
        public Guid Id { get; set; }
        public Guid GroupId { get; set; }
        public string Description { get; set; }
        public string Receipt { get; set; }
        public string CreationMethod { get; set; }
        public string CategoryKey { get; set; }
        public decimal Cost { get; set; }
        public DateTimeOffset Date { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get;set; }
        public CreatedBy CreatedBy { get; set; }
        public List<Repayments> Repayments { get; set; } = new List<Repayments>();
        public List<Users> Users { get; set; } = new List<Users>();
    }

    
}
