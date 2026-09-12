using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class StatusesService
{
    public static async Task<ApiResult<List<StatusesViewDTO>>> GetAllStatusesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await StatusesData.GetAllStatusesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<StatusesViewDTO>>(
                null,
                "لم يتم العثور على أي حالات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<StatusesViewDTO>>(
            result.Data,
            "تم استرجاع الحالات بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<StatusesDTO>> AddStatusesAsync(
        StatusesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<StatusesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون الحالات فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await StatusesData.AddStatusesAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<StatusesDTO>> UpdateStatusesByIDAsync(
        StatusesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<StatusesDTO>
            {
                Data = null,
                Message = "بيانات الحالات غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await StatusesData.UpdateStatusesByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<StatusesViewDTO>> GetStatusesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await StatusesData.GetStatusesByIDAsync(
            ID,
            cancellationToken);
    }
}