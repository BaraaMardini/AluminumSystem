using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

public class PermissionPolicyProvider
    : DefaultAuthorizationPolicyProvider
{
    public PermissionPolicyProvider(
        IOptions<AuthorizationOptions> options)
        : base(options)
    {
    }

    public override Task<AuthorizationPolicy?>
        GetPolicyAsync(string policyName)
    {
        // ==========================================
        // Dynamic Permission Policy
        // ==========================================

        if (policyName.StartsWith("Permission_"))
        {
            var value =
                policyName
                    .Replace("Permission_", "");

            if (!long.TryParse(value, out long permissionMask))
            {
                return base.GetPolicyAsync(policyName);
            }

            var policy =
                new AuthorizationPolicyBuilder()
                    .AddRequirements(
                        new PermissionRequirement(
                            permissionMask))
                    .Build();

            return Task.FromResult<AuthorizationPolicy?>(
                policy);
        }

        return base.GetPolicyAsync(policyName);
    }
}