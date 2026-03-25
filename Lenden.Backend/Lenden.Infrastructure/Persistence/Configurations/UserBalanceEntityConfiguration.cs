using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserBalanceEntityConfiguration : IEntityTypeConfiguration<UserBalanceEntity>
{
    public void Configure(EntityTypeBuilder<UserBalanceEntity> builder)
    {
        builder.ToTable("user_balances");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.GroupPublicId)
            .HasColumnName("group_id")
            .IsRequired();

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(x => x.Balance)
            .HasColumnName("balance")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.HasIndex(x => new { x.GroupPublicId, x.UserId })
            .IsUnique();
    }
}