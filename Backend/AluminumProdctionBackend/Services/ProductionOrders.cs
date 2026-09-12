using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductionOrdersService
{
    public static async Task<ApiResult<List<ProductionOrdersViewDTO>>> GetAllProductionOrdersAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionOrdersData.GetAllProductionOrdersAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionOrdersViewDTO>>(
                null,
                "لم يتم العثور على أي أوامر إنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionOrdersViewDTO>>(
            result.Data,
            "تم استرجاع أوامر الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionOrdersDTO>> AddProductionOrdersAsync(
        ProductionOrdersDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionOrdersDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون أوامر الإنتاج فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionOrdersData.AddProductionOrdersAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<ProductionOrdersDTO>> UpdateProductionOrdersByIDAsync(
        ProductionOrdersUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductionOrdersDTO>
            {
                Data = null,
                Message = "بيانات أوامر الإنتاج غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductionOrdersData.UpdateProductionOrdersByIDAsync(dto, cancellationToken);
    }

    public static async Task<ApiResult<ProductionOrdersDTO>> DeleteProductionOrdersByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionOrdersData.DeleteProductionOrdersByIDAsync(
            ID,
            cancellationToken);
    }

    public static async Task<ApiResult<List<ProductionOrdersViewDTO>>> SearchProductionOrders(
        string? ProductName,
        string? StatusName,
        CancellationToken cancellationToken = default)
    {
        var result = await ProductionOrdersData.SearchProductionOrders(
            ProductName,
            StatusName,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductionOrdersViewDTO>>(
                null,
                "لم يتم العثور على أي أوامر إنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductionOrdersViewDTO>>(
            result.Data,
            "تم استرجاع أوامر الإنتاج بنجاح.",
            ErrorType.None
        );
    }

    public static async Task<ApiResult<ProductionOrdersViewDTO>> GetProductionOrdersByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductionOrdersData.GetProductionOrdersByIDAsync(
            ID,
            cancellationToken);
    }
}