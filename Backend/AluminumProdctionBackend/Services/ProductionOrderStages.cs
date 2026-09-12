using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductionOrderStagesService
{
    public static async Task<ApiResult<List<ProductionOrderStagesViewDTO>>> GetAllProductionOrderStagesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionOrderStagesData.GetAllProductionOrderStagesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionOrderStagesViewDTO>>(
                null,
                "لم يتم العثور على أي مراحل لأوامر الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionOrderStagesViewDTO>>(
            result.Data,
            "تم استرجاع مراحل أوامر الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionOrderStagesDTO>> AddProductionOrderStagesAsync(
        ProductionOrderStagesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionOrderStagesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون مراحل أوامر الإنتاج فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionOrderStagesData.AddProductionOrderStagesAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<ProductionOrderStagesDTO>> UpdateProductionOrderStagesByIDAsync(
        ProductionOrderStagesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionOrderStagesDTO>
            {
                Data = null,
                Message = "بيانات مراحل أوامر الإنتاج غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionOrderStagesData.UpdateProductionOrderStagesByIDAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<List<ProductionOrderStagesViewDTO>>> SearchProductionOrderStages(
        int? OrderID,
        string? StageName,
        string? StatusName,
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionOrderStagesData.SearchProductionOrderStages(
            OrderID,
            StageName,
            StatusName,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionOrderStagesViewDTO>>(
                null,
                "لم يتم العثور على أي مراحل لأوامر الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionOrderStagesViewDTO>>(
            result.Data,
            "تم استرجاع مراحل أوامر الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionOrderStagesViewDTO>> GetProductionOrderStagesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionOrderStagesData.GetProductionOrderStagesByIDAsync(
            ID,
            cancellationToken);
    }
}