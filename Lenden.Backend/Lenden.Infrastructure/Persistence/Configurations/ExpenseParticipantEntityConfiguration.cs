using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class ExpenseParticipantEntityConfiguration : IEntityTypeConfiguration<ExpenseParticipantEntity>
{
    public void Configure(EntityTypeBuilder<ExpenseParticipantEntity> builder)
    {
        builder.ToTable("user_expenses");

        builder.HasKey(x => new { x.ExpenseId, x.UserId });
        builder.HasIndex(x => new { x.ExpenseId, x.UserId })
            .IsUnique();

        builder.Property(x => x.ExpenseId)
            .HasColumnName("expense_id")
            .IsRequired();

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(x => x.Paid)
            .HasColumnName("paid")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Split)
            .HasColumnName("split")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Net)
            .HasColumnName("net")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x=>x.Expense)
            .WithMany(x => x.Participants)
            .HasForeignKey(x => x.ExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

       
    }
}