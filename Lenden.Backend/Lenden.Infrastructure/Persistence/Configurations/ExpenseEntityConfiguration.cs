using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations
{
    public class ExpenseEntityConfiguration : IEntityTypeConfiguration<ExpenseEntity>
    {
        public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
        {
            // Table name
            builder.ToTable("expenses");

            // Primary key
            builder.HasKey(e => e.Id);

            // Properties
            builder.Property(e => e.PublicId)
                   .IsRequired();

            builder.Property(e => e.GroupId)
                   .IsRequired();

            builder.Property(e => e.TotalAmount)
                   .IsRequired()
                   .HasColumnType("decimal(18,2)");

            builder.Property(e => e.Description)
                   .HasMaxLength(500);

            builder.Property(e => e.ImageUrl)
                   .HasMaxLength(200);

            builder.Property(e => e.Category)
                   .IsRequired()
                   .HasConversion(new SmartEnumConverter<ExpenseCategory>());

            builder.Property(e => e.CreatedAt)
                   .IsRequired();

            // // Payers (value objects)
            // builder.OwnsMany(e => e.Payers, pb =>
            // {
            //     pb.WithOwner().HasForeignKey("ExpenseId"); // FK to Expense
            //     pb.Property<Guid>("Id");                    // PK for the owned entity
            //     pb.HasKey("Id");
            //     pb.Property(p => p.UserPublicId).IsRequired();
            //     pb.Property(p => p.Amount)
            //       .IsRequired()
            //       .HasColumnType("decimal(18,2)");
            //     pb.ToTable("ExpensePayers");
            // });
            //
            // // Splitters (value objects)
            // builder.OwnsMany(e => e.Splitters, sb =>
            // {
            //     sb.WithOwner().HasForeignKey("ExpenseId"); // FK to Expense
            //     sb.Property<Guid>("Id");                    // PK for the owned entity
            //     sb.HasKey("Id");
            //     sb.Property(s => s.UserPublicId).IsRequired();
            //     sb.Property(s => s.Amount)
            //       .IsRequired()
            //       .HasColumnType("decimal(18,2)");
            //     sb.ToTable("ExpenseSplitters");
            // });

            // Indexes (optional, for fast lookups)
            builder.HasIndex(e => e.GroupId);
            builder.HasIndex(e => e.PublicId).IsUnique();
        }
    }
}