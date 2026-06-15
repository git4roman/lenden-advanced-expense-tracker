using Lenden.Domain.Entities;
using Lenden.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;
public class ExpenseEntityConfiguration : IEntityTypeConfiguration<ExpenseEntity>
{
    public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
    {
        builder.ToTable("expenses");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.Slug)
            .HasColumnName("public_id")
            .IsRequired();

        builder.Property(x => x.GroupId)
            .HasColumnName("group_id")
            .IsRequired();

        builder.Property(x => x.CreatorId)
            .HasColumnName("creator_id")
            .IsRequired();

        builder.Property(x => x.Amount)
            .HasColumnName("cost")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Category)
            .HasColumnName("category")
            .HasConversion(new SmartEnumConverter<ExpenseCategory>())
            .IsRequired();

        builder.Property(x => x.CreationMethod)
            .HasColumnName("creation_method")
            .HasConversion(new SmartEnumConverter<CreationMethod>())
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(100)
            .HasColumnName("description");

        // builder.Property(x => x.Receipt)
        //     .HasColumnName("image_url");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.Date)
    .HasColumnName("date")
    .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Creator)
            .WithMany()
            .HasForeignKey(x => x.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Slug)
            .IsUnique();

        builder.HasIndex(x => x.GroupId);
        
        builder.OwnsMany(e => e.Repayments, r =>
        {
            r.ToTable("expense_repayments");

            r.WithOwner().HasForeignKey("expense_id");

            r.Property(x => x.From).HasColumnName("from_user_id");
            r.Property(x => x.To).HasColumnName("to_user_id");
            r.Property(x => x.Amount).HasColumnName("amount").HasColumnType("decimal(18,2)");

            r.HasKey("expense_id", "From", "To");
        });
        
        builder.OwnsOne(e => e.Receipt, r =>
        {
            r.Property(x => x.Large).HasColumnName("receipt_large");
            r.Property(x => x.Original).HasColumnName("receipt_original");
        });
    }
}