using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductionStageEntriesService
{
    public static async Task<ApiResult<List<ProductionStageEntriesViewDTO>>> GetAllProductionStageEntriesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionStageEntriesData.GetAllProductionStageEntriesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionStageEntriesViewDTO>>(
                null,
                "لم يتم العثور على أي إدخالات لمراحل الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionStageEntriesViewDTO>>(
            result.Data,
            "تم استرجاع إدخالات مراحل الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionStageEntriesDTO>> AddProductionStageEntriesAsync(
        ProductionStageEntriesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionStageEntriesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون إدخالات مراحل الإنتاج فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionStageEntriesData.AddProductionStageEntriesAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<ProductionStageEntriesDTO>> UpdateProductionStageEntriesByIDAsync(
        ProductionStageEntriesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionStageEntriesDTO>
            {
                Data = null,
                Message = "بيانات إدخالات مراحل الإنتاج غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionStageEntriesData.UpdateProductionStageEntriesByIDAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<ProductionStageEntriesDTO>> DeleteProductionStageEntriesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionStageEntriesData.DeleteProductionStageEntriesByIDAsync(
            ID,
            cancellationToken);
    }

    public static async Task<ApiResult<List<ProductionStageEntriesViewDTO>>> SearchProductionStageEntries(
        int? OrderID,
        int? OrderStageID,
        int? StageID,
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionStageEntriesData.SearchProductionStageEntries(
            OrderID,
            OrderStageID,
            StageID,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionStageEntriesViewDTO>>(
                null,
                "لم يتم العثور على أي إدخالات لمراحل الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionStageEntriesViewDTO>>(
            result.Data,
            "تم استرجاع إدخالات مراحل الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionStageEntriesViewDTO>> GetProductionStageEntriesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionStageEntriesData.GetProductionStageEntriesByIDAsync(
            ID,
            cancellationToken);
    }
}