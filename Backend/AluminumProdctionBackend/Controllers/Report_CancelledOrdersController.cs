using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/report_cancelled_orders")]
[ApiController]
public class Report_CancelledOrdersController : ControllerBase
{
    // =====================================================
    // VIEW = 549755813888
    // =====================================================

    [HasPermission(549755813888)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchReport_CancelledOrders")]
    public async Task<ActionResult> SearchReport_CancelledOrders(
        [FromQuery] SearchReport_CancelledOrdersRequest request,
        CancellationToken cancellationToken)
    {
        var result = await Report_CancelledOrdersService
            .SearchReport_CancelledOrders(
                request.OrderID,
                request.ProductName,
                request.FromDate,
                request.ToDate,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}