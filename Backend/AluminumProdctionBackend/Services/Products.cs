using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class ProductsService
{
    public static async Task<ApiResult<List<ProductsViewDTO>>> GetAllProductsAsync(
        CancellationToken cancellationToken = default)
    {
        var result = await ProductsData.GetAllProductsAsync(cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<ProductsViewDTO>>(
                null,
                "لم يتم العثور على أي منتجات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<ProductsViewDTO>>(
            result.Data,
            "تم استرجاع المنتجات بنجاح.",
            ErrorType.None
        );
    }


    public static async Task<ApiResult<ProductsDTO>> AddProductsAsync(
        ProductsDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductsDTO>
            {
                Data = null,
                Message = "لا يمكن أن تكون المنتجات فارغة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductsData.AddProductsAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<ProductsDTO>> UpdateProductsByIDAsync(
        ProductsUpdateDTO dto,
        CancellationToken cancellationToken = default)
    {
        if (dto == null)
        {
            return new ApiResult<ProductsDTO>
            {
                Data = null,
                Message = "بيانات المنتجات غير صالحة.",
                ErrorType = ErrorType.InvalidId
            };
        }

        return await ProductsData.UpdateProductsByIDAsync(dto, cancellationToken);
    }


    public static async Task<ApiResult<ProductsViewDTO>> GetProductsByIDAsync(
        int ID,
        CancellationToken cancellationToken = default)
    {
        return await ProductsData.GetProductsByIDAsync(
            ID,
            cancellationToken);
    }
}