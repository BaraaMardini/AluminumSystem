using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class Report_ProductComparisonService
{
    public static async Task<ApiResult<List<Report_ProductComparisonViewDTO>>>
        SearchReport_ProductComparison(
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            await Report_ProductComparisonData.SearchReport_ProductComparison(
                FromDate,
                ToDate,
                cancellationToken);


        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<Report_ProductComparisonViewDTO>>(
                null,
                "لم يتم العثور على أي تقارير لمقارنة المنتجات.",
                ErrorType.NotFound
            );
        }


        return new ApiResult<List<Report_ProductComparisonViewDTO>>(
            result.Data,
            "تم استرجاع تقارير مقارنة المنتجات بنجاح.",
            ErrorType.None
        );
    }
}