
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Lenden.Domain.Entities;

namespace Lenden.Infrastructure.Persistence.Configurations;
public class AuthSessionConfiguration : IEntityTypeConfiguration<AuthSessionEntity>
{
    public void Configure(EntityTypeBuilder<AuthSessionEntity> builder)
    {
        builder.ToTable("auth_sessions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(x => x.RefreshTokenHash)
            .HasColumnName("refresh_token_hash")
            .IsRequired()
            .HasMaxLength(64);

        builder.Property(x => x.DeviceInfo)
            .HasColumnName("device_info")
            .HasMaxLength(500);

        builder.Property(x => x.IpAddress)
            .HasColumnName("ip_address")
            .HasMaxLength(100);

        builder.Property(x => x.ExpiresAt)
            .HasColumnName("expires_at")
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.RevokedAt)
            .HasColumnName("revoked_at");

        builder.Property(x => x.LastUsedAt)
            .HasColumnName("last_used_at");

        // Relationship
        builder.HasOne<UserEntity>()
            .WithMany(u => u.Sessions) // if you added navigation
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}