using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("users");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.Slug)
            .HasColumnName("slug")
            .IsRequired();

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasConversion(
                v => v.Value,
                v => Email.Create(v))
            .IsRequired();

        builder.Property(x => x.PasswordHash)
            .HasColumnName("password_hash");

        builder.Property(x => x.Username)
            .HasColumnName("username")
            .IsRequired();

        builder.Property(x => x.GivenName)
            .HasColumnName("given_name")
            .IsRequired();

        builder.Property(x => x.FamilyName)
            .HasColumnName("family_name")
            .IsRequired();

        builder.Property(x => x.Role)
            .HasColumnName("role")
            .HasConversion(new SmartEnumConverter<UserRole>())
            .IsRequired();

        builder.Property(x => x.EmailVerified)
            .HasColumnName("email_verified")
            .IsRequired();

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(new SmartEnumConverter<UserStatus>())
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.HasOne(x => x.UserInfo)
            .WithOne()
            .HasForeignKey<UserInfoEntity>(x => x.UserId);

        builder.HasMany(x => x.Sessions)
            .WithOne()
            .HasForeignKey("user_id")
            .OnDelete(DeleteBehavior.Cascade);

        

        builder.HasMany(x => x.AuthProviders)
            .WithOne()
            .HasForeignKey("user_id")
            .OnDelete(DeleteBehavior.Cascade);

        

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.HasIndex(x => x.Username)
            .IsUnique();

        builder.HasIndex(x => x.Slug)
            .IsUnique();
    }
}