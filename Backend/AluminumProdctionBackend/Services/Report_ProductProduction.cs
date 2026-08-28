using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class Report_ProductProductionService
{
    public static async Task<
        ApiResult<List<Report_ProductProductionViewDTO>>>
        SearchReport_ProductProduction(
            int? ProductID,
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            await Report_ProductProductionData
                .SearchReport_ProductProduction(
                    ProductID,
                    FromDate,
                    ToDate,
                    cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<List<Report_ProductProductionViewDTO>>(
                null,
                "لم يتم العثور على أي تقارير لإنتاج المنتجات.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<List<Report_ProductProductionViewDTO>>(
            result.Data,
            "تم استرجاع تقارير إنتاج المنتجات بنجاح.",
            ErrorType.None
        );
    }
}