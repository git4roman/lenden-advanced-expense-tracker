    using Lenden.Application.Interfaces.Services;
    using Lenden.Application.Interfaces.Validators;
    using Lenden.Application.Managers;
    using Lenden.Application.Services;
    using Lenden.Application.Validatiors;
    using Lenden.Domain.Entities;
    using Microsoft.AspNetCore.Identity;
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
            services.AddScoped<FirebaseService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IPasswordHasher<UserEntity>, PasswordHasher<UserEntity>>();
            services.AddScoped<ISettlementService, SettlementService>();
            return services;
        }
    }