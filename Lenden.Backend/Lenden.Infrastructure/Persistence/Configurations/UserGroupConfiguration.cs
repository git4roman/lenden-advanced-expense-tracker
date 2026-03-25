using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserGroupEntityConfiguration : IEntityTypeConfiguration<UserGroupEntity>
{
    public void Configure(EntityTypeBuilder<UserGroupEntity> builder)
    {
        builder.ToTable("user_groups");

        builder.HasKey(x => new { x.UserId, x.GroupId });

        builder.Property(x => x.UserId)
            .HasColumnName("user_id");

        builder.Property(x => x.GroupId)
            .HasColumnName("group_id");

        builder.Property(x => x.Role)
            .HasColumnName("role")
            .HasConversion(new SmartEnumConverter<UserGroupRole>())
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(new SmartEnumConverter<GroupMembershipStatus>())
            .IsRequired();

        builder.Property(x => x.JoinedAt)
            .HasColumnName("joined_at")
            .IsRequired();

        builder.Property(x => x.LeftAt)
            .HasColumnName("left_at");

        builder.Property(x => x.InvitedByUserId)
            .HasColumnName("invited_by_user_id");

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Group)
            .WithMany()
            .HasForeignKey(x => x.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.InvitedByUser)
            .WithMany()
            .HasForeignKey(x => x.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.GroupId, x.Status });
    }
}