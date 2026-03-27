using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class GroupEntityConfiguration : IEntityTypeConfiguration<GroupEntity>
{
    public void Configure(EntityTypeBuilder<GroupEntity> builder)
    {
        builder.ToTable("groups");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.Slug)
            .HasColumnName("slug")
            .IsRequired();

        builder.Property(x => x.Name)
            .HasColumnName("name")
            .IsRequired();

        builder.Property(x => x.ImageUrl)
            .HasColumnName("image_url");

        builder.Property(x => x.CreatedBy)
            .HasColumnName("created_by")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(new SmartEnumConverter<GroupStatus>())
            .IsRequired();
       

     
        builder.HasIndex(x => x.Slug)
            .IsUnique();

        builder.HasIndex(x => x.Name);
    }
}