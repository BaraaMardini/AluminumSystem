using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/productionorderstagess")]
[ApiController]
public class ProductionOrderStagesController : ControllerBase
{
    // =====================================================
    // VIEW = 65536
    // =====================================================

    [HasPermission(65536)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllProductionOrderStages")]
    public async Task<ActionResult> GetAllProductionOrderStages(
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrderStagesService
            .GetAllProductionOrderStagesAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 32768
    // =====================================================

    [HasPermission(32768)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddProductionOrderStages")]
    public async Task<ActionResult> AddProductionOrderStages(
        [FromBody] ProductionOrderStagesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrderStagesService
            .AddProductionOrderStagesAsync(dto, cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetProductionOrderStagesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 131072
    // =====================================================

    [HasPermission(131072)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateProductionOrderStagesByID")]
    public async Task<ActionResult> UpdateProductionOrderStagesByID(
        int id,
        [FromBody] ProductionOrderStagesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await ProductionOrderStagesService
            .UpdateProductionOrderStagesByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 65536
    // =====================================================

    [HasPermission(65536)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchProductionOrderStages")]
    public async Task<ActionResult> SearchProductionOrderStages(
        [FromQuery] SearchProductionOrderStagesRequest request,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrderStagesService
            .SearchProductionOrderStages(
                request.OrderID,
                request.StageName,
                request.StatusName,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 65536
    // =====================================================

    [HasPermission(65536)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetProductionOrderStagesByID")]
    public async Task<ActionResult> GetProductionOrderStagesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionOrderStagesService
            .GetProductionOrderStagesByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}