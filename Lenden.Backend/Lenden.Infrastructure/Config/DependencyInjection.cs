using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Services;
using Lenden.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Lenden.Infrastructure.Config;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
       
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAuthService, AuthenticationService>();
        services.AddScoped<TokenService>();


        return services;
    }
}