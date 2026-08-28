using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/report_production_summary")]
[ApiController]
public class Report_ProductionSummaryController : ControllerBase
{
    // =====================================================
    // VIEW = 2199023255552
    // =====================================================

    [HasPermission(2199023255552)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchReport_ProductionSummary")]
    public async Task<ActionResult> SearchReport_ProductionSummary(
        [FromQuery] SearchReport_ProductionSummaryRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await Report_ProductionSummaryService
                .SearchReport_ProductionSummary(
                    request.FromDate,
                    request.ToDate,
                    cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}