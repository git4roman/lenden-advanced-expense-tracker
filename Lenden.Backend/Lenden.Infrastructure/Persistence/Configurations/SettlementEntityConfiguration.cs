using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations;

public class SettlementEntityConfiguration: IEntityTypeConfiguration<SettlementEntity>
{
    public void Configure(EntityTypeBuilder<SettlementEntity> builder)
    {
        builder.ToTable("settlements");
        builder.HasKey(x => x.Id);
        builder.Property(x=>x.Slug).HasColumnName("slug");
        builder.Property(x=>x.CreditorId).HasColumnName("creditor_id").IsRequired();
        builder.Property(x=>x.DebtorId).HasColumnName("debtor_id").IsRequired();
        builder.Property(x=>x.GroupId).HasColumnName("group_id").IsRequired();
        builder.Property(x=>x.Amount).HasColumnName("amount").HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(x=>x.Status).HasColumnName("status").HasConversion(new SmartEnumConverter<SettlementStatusEnums>()).IsRequired();  
        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();
        
        builder.HasOne(x=>x.Creditor).WithMany().HasForeignKey(x=>x.CreditorId);
        builder.HasOne(x=>x.Debtor).WithMany().HasForeignKey(x=>x.DebtorId);
        builder.HasOne(x=>x.Group).WithMany(x=>x.Settlements).HasForeignKey(u=>u.GroupId);
        
    }
}