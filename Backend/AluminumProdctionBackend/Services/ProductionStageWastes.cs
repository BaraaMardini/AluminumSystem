using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductionStageWastesService
{
    public static async Task<ApiResult<List<ProductionStageWastesViewDTO>>> GetAllProductionStageWastesAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionStageWastesData.GetAllProductionStageWastesAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionStageWastesViewDTO>>(
                null,
                "لم يتم العثور على أي مخلفات لمراحل الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionStageWastesViewDTO>>(
            result.Data,
            "تم استرجاع مخلفات مراحل الإنتاج بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<ProductionStageWastesDTO>> AddProductionStageWastesAsync(
        ProductionStageWastesDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionStageWastesDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون مخلفات مراحل الإنتاج فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionStageWastesData.AddProductionStageWastesAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<ProductionStageWastesDTO>> UpdateProductionStageWastesByIDAsync(
        ProductionStageWastesUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionStageWastesDTO>
            {
                Data = null,
                Message = "بيانات مخلفات مراحل الإنتاج غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionStageWastesData.UpdateProductionStageWastesByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<ProductionStageWastesDTO>> DeleteProductionStageWastesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionStageWastesData.DeleteProductionStageWastesByIDAsync(
            ID,
            cancellationToken);
    }


    public static async Task<ApiResult<List<ProductionStageWastesViewDTO>>> SearchProductionStageWastes(
        int? OrderStageID,
        string? StageName,
        string? WasteTypesName,
        string? WasteReasonsName,
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionStageWastesData.SearchProductionStageWastes(
            OrderStageID,
            StageName,
            WasteTypesName,
            WasteReasonsName,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionStageWastesViewDTO>>(
                null,
                "لم يتم العثور على أي مخلفات لمراحل الإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionStageWastesViewDTO>>(
            result.Data,
            "تم استرجاع مخلفات مراحل الإنتاج بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<ProductionStageWastesViewDTO>> GetProductionStageWastesByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionStageWastesData.GetProductionStageWastesByIDAsync(
            ID,
            cancellationToken);
    }
}