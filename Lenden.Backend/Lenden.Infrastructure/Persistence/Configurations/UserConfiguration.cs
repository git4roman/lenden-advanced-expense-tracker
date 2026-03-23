using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("users"); // MySQL table name

        builder.HasKey(u => u.Id);

        // Slug - unique
        builder.Property(u => u.Slug)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(u => u.Slug)
            .IsUnique();

        // Email (Value Object)
        builder.Property(u => u.Email)
            .HasConversion(
                v => v.Value,
                v => Email.Create(v))
            .IsRequired()
            .HasMaxLength(320);

        // Password hash
        builder.Property(u => u.PasswordHash)
            .HasMaxLength(256);

        // EmailVerified
        builder.Property(u => u.EmailVerified)
            .IsRequired();

        

        // Status - SmartEnum converter
        builder.Property(u => u.Status)
            .HasConversion(new SmartEnumConverter<UserStatus>())
            .IsRequired();

        // Role - SmartEnum converter
        builder.Property(u => u.Role)
            .HasConversion(new SmartEnumConverter<UserRole>())
            .IsRequired();

        // UserInfoId foreign key
        // builder.Property(u => u.UserInfoId)
        //     .IsRequired(false);

        // CreatedAt & UpdatedAt
        builder.Property(u => u.CreatedAt)
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .IsRequired();

        // Sessions - one-to-many
        builder.HasMany(u => u.Sessions)
            .WithOne()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // AuthProviders - one-to-many
        builder.HasMany(u => u.AuthProviders)
            .WithOne()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(u => u.UserInfo)
            .WithOne(ui => ui.User)
            .HasForeignKey<UserInfoEntity>(ui => ui.UserId)  // FK lives on UserInfo side
            .IsRequired(false);
    }
}
