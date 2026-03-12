using Microsoft.Extensions.DependencyInjection;

namespace Lenden.API.ServiceCollectionExtensions
{
    public static class CorsServiceCollectionExtensions
    {
        public static IServiceCollection AddCorsPolicies(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });

                options.AddPolicy("FrontendPolicy", builder =>
                {
                    builder
                        .WithOrigins("https://example.com")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            return services;
        }
    }
}