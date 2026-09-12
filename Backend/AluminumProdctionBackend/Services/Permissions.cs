using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class PermissionsService
{
    public static async Task<ApiResult<List<PermissionsViewDTO>>> GetAllPermissionsAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await PermissionsData.GetAllPermissionsAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<PermissionsViewDTO>>(
                null,
                "لم يتم العثور على أي صلاحيات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<PermissionsViewDTO>>(
            result.Data,
            "تم استرجاع الصلاحيات بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<PermissionsDTO>> AddPermissionsAsync(
        PermissionsDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<PermissionsDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون الصلاحيات فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await PermissionsData.AddPermissionsAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<PermissionsDTO>> UpdatePermissionsByIDAsync(
        PermissionsUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<PermissionsDTO>
            {
                Data = null,
                Message = "بيانات الصلاحيات غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await PermissionsData.UpdatePermissionsByIDAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<List<PermissionsViewDTO>>> SearchPermissions(
        string? ModuleName,
        CancellationToken cancellationToken = default)
    {
        var result = await PermissionsData.SearchPermissions(
            ModuleName,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<PermissionsViewDTO>>(
                null,
                "لم يتم العثور على أي صلاحيات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<PermissionsViewDTO>>(
            result.Data,
            "تم استرجاع الصلاحيات بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<PermissionsViewDTO>> GetPermissionsByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await PermissionsData.GetPermissionsByIDAsync(
            ID,
            cancellationToken);
    }
}