
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductionStagesService
{

public static async Task<ApiResult<List<ProductionStagesViewDTO>>> GetAllProductionStagesAsync(
    CancellationToken cancellationToken = default)
{
    var result = await ProductionStagesData.GetAllProductionStagesAsync(cancellationToken);

    if (result.Data == null || result.Data.Count == 0)
    {
        return new ApiResult<List<ProductionStagesViewDTO>>(
            null,
            "No ProductionStagess found.",
            ErrorType.NotFound
        );
    }

    return new ApiResult<List<ProductionStagesViewDTO>>(
        result.Data,
        "ProductionStagess retrieved successfully.",
        ErrorType.None
    );
}


public static async Task<ApiResult<ProductionStagesDTO>> AddProductionStagesAsync(
    ProductionStagesDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null)
    {
        return new ApiResult<ProductionStagesDTO>
        {
            Data = null,
            Message = "ProductionStages cannot be null.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductionStagesData.AddProductionStagesAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ProductionStagesDTO>> UpdateProductionStagesByIDAsync(
    ProductionStagesUpdateDTO dto,
    CancellationToken cancellationToken = default)
{
    if (dto == null )
    {
        return new ApiResult<ProductionStagesDTO>
        {
            Data = null,
            Message = "Invalid ProductionStages data.",
            ErrorType = ErrorType.InvalidId
        };
    }

    return await ProductionStagesData.UpdateProductionStagesByIDAsync(dto, cancellationToken);
}


public static async Task<ApiResult<ProductionStagesViewDTO>> GetProductionStagesByIDAsync(
    int ID,
    CancellationToken cancellationToken = default)
{
  
    return await ProductionStagesData.GetProductionStagesByIDAsync(
        ID,
        cancellationToken);
}

}

