using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserGroupEntityConfiguration : IEntityTypeConfiguration<UserGroupEntity>
{
    public void Configure(EntityTypeBuilder<UserGroupEntity> builder)
    {
        // Table
        builder.ToTable("UserGroups");

        // Composite PK
        builder.HasKey(ug => new { ug.UserId, ug.GroupId });

        // FKs
        builder.HasOne(ug => ug.User)
            .WithMany()
            .HasForeignKey(ug => ug.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ug => ug.Group)
            .WithMany(g => g.UserGroups)
            .HasForeignKey(ug => ug.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ug => ug.InvitedByUser)
            .WithMany()
            .HasForeignKey(ug => ug.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Properties
        builder.Property(ug => ug.JoinedAt)
            .IsRequired();

        builder.Property(ug => ug.LeftAt);

        // SmartEnum Converters
        builder.Property(ug => ug.Role)
            .HasConversion(new SmartEnumConverter<UserGroupRole>())
            .IsRequired();

        builder.Property(ug => ug.Status)
            .HasConversion(new SmartEnumConverter<GroupMembershipStatus>())
            .IsRequired();
    }
}