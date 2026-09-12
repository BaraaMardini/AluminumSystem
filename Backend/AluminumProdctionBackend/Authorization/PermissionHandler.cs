using Microsoft.AspNetCore.Authorization;

public class PermissionHandler
    : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        // ==========================================
        // Get PermissionMask from JWT
        // ==========================================

        var maskClaim =
            context.User.FindFirst("PermissionMask")?.Value;

        // ==========================================
        // Validate and Convert
        // ==========================================

        if (!long.TryParse(maskClaim, out long userMask))
        {
            return Task.CompletedTask;
        }

        // ==========================================
        // Check Permission
        // ==========================================

        if (requirement.PermissionMask != 0)
        {
            bool hasPermission =
                (userMask & requirement.PermissionMask)
                == requirement.PermissionMask;

            if (!hasPermission)
            {
                return Task.CompletedTask;
            }
        }

        // ==========================================
        // User has required permission
        // ==========================================

        context.Succeed(requirement);

        return Task.CompletedTask;
    }
}