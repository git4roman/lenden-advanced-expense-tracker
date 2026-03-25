using Lenden.Domain.Entities;
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

        builder.Property(x => x.PublicId)
            .HasColumnName("public_id")
            .IsRequired();

        builder.Property(x => x.GroupId)
            .HasColumnName("group_id")
            .IsRequired();

        builder.Property(x => x.CreatorId)
            .HasColumnName("creator_id")
            .IsRequired();

        builder.Property(x => x.TotalAmount)
            .HasColumnName("total_amount")
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(x => x.Category)
            .HasColumnName("category")
            .HasConversion(new SmartEnumConverter<ExpenseCategory>())
            .IsRequired();

        builder.Property(x => x.Description)
            .HasColumnName("description");

        builder.Property(x => x.ImageUrl)
            .HasColumnName("image_url");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Creator)
            .WithMany()
            .HasForeignKey(x => x.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Participants)
            .WithOne()
            .HasForeignKey("expense_id")
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Participants)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(x => x.PublicId)
            .IsUnique();

        builder.HasIndex(x => x.GroupId);
    }
}