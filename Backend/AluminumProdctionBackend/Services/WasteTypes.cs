using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class WasteTypesService
{
    public static async Task<ApiResult<List<WasteTypesViewDTO>>> GetAllWasteTypesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await WasteTypesData.GetAllWasteTypesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<WasteTypesViewDTO>>(
                null,
                "لم يتم العثور على أي أنواع للهدر.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<WasteTypesViewDTO>>(
            result.Data,
            "تم استرجاع أنواع الهدر بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<WasteTypesDTO>> AddWasteTypesAsync(
        WasteTypesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<WasteTypesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون أنواع الهدر فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await WasteTypesData.AddWasteTypesAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<WasteTypesDTO>> UpdateWasteTypesByIDAsync(
        WasteTypesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<WasteTypesDTO>
            {
                Data = null,
                Message = "بيانات أنواع الهدر غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await WasteTypesData.UpdateWasteTypesByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<WasteTypesViewDTO>> GetWasteTypesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await WasteTypesData.GetWasteTypesByIDAsync(
            ID,
            cancellationToken);
    }
}