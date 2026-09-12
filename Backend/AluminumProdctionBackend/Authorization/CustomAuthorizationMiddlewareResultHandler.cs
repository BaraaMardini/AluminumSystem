using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

public class CustomAuthorizationMiddlewareResultHandler
    : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler _defaultHandler;

    public CustomAuthorizationMiddlewareResultHandler()
    {
        _defaultHandler =
            new AuthorizationMiddlewareResultHandler();
    }

    public async Task HandleAsync(
        RequestDelegate next,
        HttpContext context,
        AuthorizationPolicy policy,
        PolicyAuthorizationResult authorizeResult)
    {
        // ==========================================
        // 403 - Authenticated but no permission
        // ==========================================

        if (authorizeResult.Forbidden)
        {
            context.Response.StatusCode =
                StatusCodes.Status403Forbidden;

            context.Response.ContentType =
                "application/json";

            var response = new
            {
                data = (object?)null,
                message = "ليس لديك إذن للقيام بهذا الإجراء",
                errorCode = StatusCodes.Status403Forbidden
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));

            return;
        }

        // ==========================================
        // 401 - Not authenticated
        // ==========================================

        if (authorizeResult.Challenged)
        {
            context.Response.StatusCode =
                StatusCodes.Status401Unauthorized;

            context.Response.ContentType =
                "application/json";

            var response = new
            {
                data = (object?)null,
                message = "Unauthorized",
                errorCode = StatusCodes.Status401Unauthorized
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));

            return;
        }

        // ==========================================
        // Default ASP.NET Core behavior
        // ==========================================

        await _defaultHandler.HandleAsync(
            next,
            context,
            policy,
            authorizeResult);
    }
}