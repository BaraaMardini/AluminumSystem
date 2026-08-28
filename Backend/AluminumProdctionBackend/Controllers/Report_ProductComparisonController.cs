using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/report_product_comparison")]
[ApiController]
public class Report_ProductComparisonController : ControllerBase
{
    // =====================================================
    // VIEW = 1099511627776
    // =====================================================

    [HasPermission(1099511627776)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchReport_ProductComparison")]
    public async Task<ActionResult> SearchReport_ProductComparison(
        [FromQuery] SearchReport_ProductComparisonRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await Report_ProductComparisonService
                .SearchReport_ProductComparison(
                    request.FromDate,
                    request.ToDate,
                    cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}