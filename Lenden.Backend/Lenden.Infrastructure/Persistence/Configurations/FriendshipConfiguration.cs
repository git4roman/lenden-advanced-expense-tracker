using Lenden.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Infrastructure.Persistence.Configurations
{
    public class FriendshipEntityConfiguration : IEntityTypeConfiguration<FriendshipEntity>
    {
        public void Configure(EntityTypeBuilder<FriendshipEntity> builder)
        {
            builder.ToTable("UserFriends");

            // Composite primary key
            builder.HasKey(uf => new { uf.RequesterId, uf.RecipientId });

            builder.Property(uf => uf.Status)
                .HasConversion(new SmartEnumConverter<FriendshipStatus>()) 
                .IsRequired();

            builder.Property(uf => uf.CreatedAt)
                .IsRequired();

            // Relationships
            builder.HasOne(uf => uf.Requester)
                .WithMany()
                .HasForeignKey(uf => uf.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(uf => uf.Recipient)
                .WithMany()
                .HasForeignKey(uf => uf.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            builder.HasIndex(uf => uf.RecipientId);                    
            builder.HasIndex(uf => uf.Status);                        
            builder.HasIndex(uf => new { uf.RecipientId, uf.Status });
        }
    }
}