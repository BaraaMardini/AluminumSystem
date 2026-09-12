using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/report_product_production")]
[ApiController]
public class Report_ProductProductionController : ControllerBase
{
    // =====================================================
    // VIEW = 4398046511104
    // =====================================================

    [HasPermission(4398046511104)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchReport_ProductProduction")]
    public async Task<ActionResult> SearchReport_ProductProduction(
        [FromQuery] SearchReport_ProductProductionRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await Report_ProductProductionService
                .SearchReport_ProductProduction(
                    request.ProductID,
                    request.FromDate,
                    request.ToDate,
                    cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}