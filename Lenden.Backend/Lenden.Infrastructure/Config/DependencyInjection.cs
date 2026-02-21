using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Lenden.Application.Services;
using Lenden.Infrastructure.Persistence;
using Lenden.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Infrastructure.Config;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
       
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<TokenService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<AuthManager>();
        services.AddScoped<GroupManager>();
        services.AddScoped<IGroupService, GroupService>();
        services.AddScoped<IUserBalanceRepository, UserBalanceRepository>();
        services.AddScoped<IUserGroupRepository, UserGroupRepository>();
        



        return services;
    }
}