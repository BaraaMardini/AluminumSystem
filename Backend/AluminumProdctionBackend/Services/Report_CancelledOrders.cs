using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class Report_CancelledOrdersService
{
    public static async Task<ApiResult<List<Report_CancelledOrdersViewDTO>>>
        SearchReport_CancelledOrders(
            int? OrderID,
            string? ProductName,
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            await Report_CancelledOrdersData.SearchReport_CancelledOrders(
                OrderID,
                ProductName,
                FromDate,
                ToDate,
                cancellationToken);

        // =====================================================
        // No Data
        // =====================================================

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<Report_CancelledOrdersViewDTO>>(
                null,
                "لم يتم العثور على أي طلبات ملغاة.",
                ErrorType.NotFound
            );
        }

        // =====================================================
        // Success
        // =====================================================

        return new ApiResult<List<Report_CancelledOrdersViewDTO>>(
            result.Data,
            "تم استرجاع تقرير الطلبات الملغاة بنجاح.",
            ErrorType.None
        );
    }
}