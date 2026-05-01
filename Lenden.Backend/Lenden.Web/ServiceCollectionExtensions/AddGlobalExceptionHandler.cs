using Lenden.Web.Models.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

public static class AddGlobalExceptionHandler
{
    public static void UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

                context.Response.ContentType = "application/json";

                if (exception is AppException appEx)
                {
                    context.Response.StatusCode = appEx.StatusCode;

                    await context.Response.WriteAsJsonAsync(new
                    {
                        message = appEx.Message
                    });

                    return;
                }

                context.Response.StatusCode = 500;

                await context.Response.WriteAsJsonAsync(new
                {
                    message = "Internal server error"
                });
            });
        });
    }
}