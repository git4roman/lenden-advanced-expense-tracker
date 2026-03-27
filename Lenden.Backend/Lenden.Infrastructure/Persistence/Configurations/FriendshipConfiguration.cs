using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace Lenden.Infrastructure.Persistence.Configurations;

public class FriendshipEntityConfiguration : IEntityTypeConfiguration<FriendshipEntity>
{
    public void Configure(EntityTypeBuilder<FriendshipEntity> builder)
    {
        builder.ToTable("friendships");

        builder.HasKey(x => new { x.RequesterId, x.RecipientId });

        builder.Property(x => x.RequesterId)
            .HasColumnName("requester_id");

        builder.Property(x => x.RecipientId)
            .HasColumnName("recipient_id");

        builder.Property(x => x.Status)
            .HasColumnName("status")
            .HasConversion(new SmartEnumConverter<FriendshipStatus>())
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();
        
        builder.Property(x => x.UpdatedAt)
            .HasColumnName("updated_at")
            .IsRequired();

        builder.HasOne(x => x.Requester)
            .WithMany()
            .HasForeignKey(x => x.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Recipient)
            .WithMany()
            .HasForeignKey(x => x.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.RequesterId, x.RecipientId })
            .IsUnique();
    }
}