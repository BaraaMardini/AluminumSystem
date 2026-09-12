using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public static class Report_ProductionSummaryService
{
    public static async Task<
        ApiResult<List<Report_ProductionSummaryViewDTO>>>
        SearchReport_ProductionSummary(
            DateTime? FromDate,
            DateTime? ToDate,
            CancellationToken cancellationToken = default)
    {
        var result =
            await Report_ProductionSummaryData
                .SearchReport_ProductionSummary(
                    FromDate,
                    ToDate,
                    cancellationToken);

        if (result.Data == null || result.Data.Count == 0)
        {
            return new ApiResult<
                List<Report_ProductionSummaryViewDTO>>(
                null,
                "لم يتم العثور على أي ملخصات للإنتاج.",
                ErrorType.NotFound
            );
        }

        return new ApiResult<
            List<Report_ProductionSummaryViewDTO>>(
            result.Data,
            "تم استرجاع ملخص الإنتاج بنجاح.",
            ErrorType.None
        );
    }
}