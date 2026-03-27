    using Lenden.Application.Interfaces.Services;
    using Lenden.Application.Interfaces.Validators;
    using Lenden.Application.Managers;
    using Lenden.Application.Services;
    using Lenden.Application.Validatiors;
    using Microsoft.Extensions.DependencyInjection;

    namespace Lenden.Application;

    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IExpenseService, ExpenseService>();
            services.AddScoped<IGroupService, GroupService>();
            services.AddScoped<TokenService>(); 
            services.AddScoped<IGroupValidators, GroupValidator>();
            services.AddScoped<IFriendshipService, FriendshipService>();
            services.AddScoped<AuthManager>();
            services.AddScoped<IUserService, UserService>();
            return services;
        }
    }