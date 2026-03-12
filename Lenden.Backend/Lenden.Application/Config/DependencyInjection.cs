using Lenden.Application.Interfaces.Services;
using Lenden.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Lenden.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IGroupService, GroupService>();
        return services;
    }
}