using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class Report_OrdersService
{
    public static async Task<ApiResult<List<Report_OrdersViewDTO>>> SearchReport_Orders(
        int? OrderID,
        string? ProductName,
        string? StatusName,
        DateTime? FromDate,
        DateTime? ToDate,
        CancellationToken cancellationToken = default)
    {
        var result = await Report_OrdersData.SearchReport_Orders(
            OrderID,
            ProductName,
            StatusName,
            FromDate,
            ToDate,
            cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<Report_OrdersViewDTO>>(
                null,
                "لم يتم العثور على أي تقارير للطلبات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<Report_OrdersViewDTO>>(
            result.Data,
            "تم استرجاع تقارير الطلبات بنجاح.",
            ErrorType.None
        );
    }
}