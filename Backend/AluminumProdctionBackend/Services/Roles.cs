using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class RolesService
{
    public static async Task<ApiResult<List<RolesViewDTO>>> GetAllRolesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await RolesData.GetAllRolesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<RolesViewDTO>>(
                null,
                "لم يتم العثور على أي أدوار.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<RolesViewDTO>>(
            result.Data,
            "تم استرجاع الأدوار بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<RolesDTO>> AddRolesAsync(
        RolesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<RolesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون الأدوار فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await RolesData.AddRolesAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<RolesDTO>> UpdateRolesByIDAsync(
        RolesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<RolesDTO>
            {
                Data = null,
                Message = "بيانات الأدوار غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await RolesData.UpdateRolesByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<RolesViewDTO>> GetRolesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await RolesData.GetRolesByIDAsync(
            ID,
            cancellationToken);
    }
}