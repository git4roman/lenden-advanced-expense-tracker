using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations;

public class GroupEntityConfiguration : IEntityTypeConfiguration<GroupEntity>
{
    public void Configure(EntityTypeBuilder<GroupEntity> builder)
    {
        // Table
        builder.ToTable("Groups");

        // PK
        builder.HasKey(g => g.Id);

        // Properties
        builder.Property(g => g.Slug)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(g => g.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(g => g.ImageUrl)
            .HasMaxLength(500);

        builder.Property(g => g.CreatedBy)
            .IsRequired();

        builder.Property(g => g.CreatedAt)
            .IsRequired();

        builder.Property(g => g.UpdatedAt)
            .IsRequired();

        // Navigation
        builder.HasMany(g => g.Members)
            .WithOne(ug => ug.Group)
            .HasForeignKey(ug => ug.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}