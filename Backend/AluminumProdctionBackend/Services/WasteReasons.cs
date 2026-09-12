using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class WasteReasonsService
{
    public static async Task<ApiResult<List<WasteReasonsViewDTO>>> GetAllWasteReasonsAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await WasteReasonsData.GetAllWasteReasonsAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<WasteReasonsViewDTO>>(
                null,
                "لم يتم العثور على أي أسباب للهدر.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<WasteReasonsViewDTO>>(
            result.Data,
            "تم استرجاع أسباب الهدر بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<WasteReasonsDTO>> AddWasteReasonsAsync(
        WasteReasonsDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<WasteReasonsDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون أسباب الهدر فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await WasteReasonsData.AddWasteReasonsAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<WasteReasonsDTO>> UpdateWasteReasonsByIDAsync(
        WasteReasonsUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<WasteReasonsDTO>
            {
                Data = null,
                Message = "بيانات أسباب الهدر غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await WasteReasonsData.UpdateWasteReasonsByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<WasteReasonsViewDTO>> GetWasteReasonsByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await WasteReasonsData.GetWasteReasonsByIDAsync(
            ID,
            cancellationToken);
    }
}