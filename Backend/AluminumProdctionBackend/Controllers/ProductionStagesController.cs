using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/productionstagess")]
[ApiController]
public class ProductionStagesController : ControllerBase
{
    // =====================================================
    // VIEW = 8388608
    // =====================================================

    [HasPermission(8388608)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllProductionStages")]
    public async Task<ActionResult> GetAllProductionStages(
        CancellationToken cancellationToken)
    {
        var result = await ProductionStagesService
            .GetAllProductionStagesAsync(cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 4194304
    // =====================================================

    [HasPermission(4194304)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddProductionStages")]
    public async Task<ActionResult> AddProductionStages(
        [FromBody] ProductionStagesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStagesService
            .AddProductionStagesAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetProductionStagesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 16777216
    // =====================================================

    [HasPermission(16777216)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateProductionStagesByID")]
    public async Task<ActionResult> UpdateProductionStagesByID(
        int id,
        [FromBody] ProductionStagesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await ProductionStagesService
            .UpdateProductionStagesByIDAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 8388608
    // =====================================================

    [HasPermission(8388608)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetProductionStagesByID")]
    public async Task<ActionResult> GetProductionStagesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await ProductionStagesService
            .GetProductionStagesByIDAsync(
                id,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}