using Lenden.Domain.Entities;
using Lenden.Domain.ValueObject;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserConfiguration: IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
      
        builder.ToTable("users"); // MySQL table name

        // Primary Key
        builder.HasKey(u => u.Id);

        // PublicId - unique
        builder.Property(u => u.PublicId)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(u => u.PublicId)
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
            .IsRequired()
            .HasMaxLength(256);

        // Email verified
        builder.Property(u => u.EmailVerified)
            .IsRequired();

        // Status - SmartEnum converter
        builder.Property(u => u.Status)
            .HasConversion(new SmartEnumConverter<UserStatus>()) // from Ardalis.SmartEnum
            .IsRequired();

        // UserInfoId foreign key
        builder.Property(u => u.UserInfoId)
            .IsRequired();

        // Sessions - one-to-many
        builder.HasMany(u => u.Sessions)
            .WithOne()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}