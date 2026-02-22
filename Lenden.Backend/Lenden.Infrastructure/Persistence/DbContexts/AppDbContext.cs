using Lenden.Domain.Entities;
using Lenden.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Infrastructure.Persistence.DbContexts;

public class AppDbContext: DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options)
    {
        
    }
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<UserInfoEntity> UserInfos { get; set; }
    public DbSet<GroupEntity> Groups { get; set; }
    public DbSet<UserGroupEntity> UserGroups { get; set; }
    public DbSet<UserBalanceEntity> UserBalances { get; set; }
    public DbSet<ExpenseEntity> Expenses { get; set; }
    public DbSet<AuthSessionEntity> AuthSessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new UserGroupEntityConfiguration());
        modelBuilder.ApplyConfiguration(new GroupEntityConfiguration());
        modelBuilder.ApplyConfiguration(new ExpenseEntityConfiguration());
    }
}