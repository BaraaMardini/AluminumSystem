using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/report_orderss")]
[ApiController]
public class Report_OrdersController : ControllerBase
{
    // =====================================================
    // VIEW = 274877906944
    // =====================================================

    [HasPermission(274877906944)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchReport_Orders")]
    public async Task<ActionResult> SearchReport_Orders(
        [FromQuery] SearchReport_OrdersRequest request,
        CancellationToken cancellationToken)
    {
        var result = await Report_OrdersService.SearchReport_Orders(
            request.OrderID,
            request.ProductName,
            request.StatusName,
            request.FromDate,
            request.ToDate,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}