using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Infrastructure.Persistence;
using Lenden.Infrastructure.Persistence.DbContexts;
using Lenden.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Lenden.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21))));
        
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IUserGroupRepository, UserGroupRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFriendshipRepository, FriendShipRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ISettlementRepository, SettlementRepository>();
        return services;
    }
}