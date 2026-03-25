using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class UserInfoEntityConfiguration : IEntityTypeConfiguration<UserInfoEntity>
{
    public void Configure(EntityTypeBuilder<UserInfoEntity> builder)
    {
        builder.ToTable("user_infos");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id)
            .HasColumnName("id");

        builder.Property(x => x.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        builder.Property(x => x.PhoneNumber)
            .HasColumnName("phone_number");

        builder.Property(x => x.Address)
            .HasColumnName("address");

        builder.Property(x => x.ImageUrl)
            .HasColumnName("image_url");

        builder.Property(x => x.DateOfBirth)
            .HasColumnName("date_of_birth");

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithOne(x => x.UserInfo)
            .HasForeignKey<UserInfoEntity>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.UserId)
            .IsUnique();
    }
}