
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;


[Route("api/productionstageentriess")]
[ApiController]
public class ProductionStageEntriesController : ControllerBase
{
  [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("all", Name = "GetAllProductionStageEntries")]
public async Task<ActionResult> GetAllProductionStageEntries(
    CancellationToken cancellationToken)
{
    var result = await ProductionStageEntriesService.GetAllProductionStageEntriesAsync(cancellationToken);
    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
       [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPost(Name = "AddProductionStageEntries")]
public async Task<ActionResult> AddProductionStageEntries(
    [FromBody] ProductionStageEntriesDTO dto,
    CancellationToken cancellationToken)
{
    var result = await ProductionStageEntriesService.AddProductionStageEntriesAsync(dto, cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(
        this,
        result.ErrorType,
        result,
        newID: result.Data?.ID,
        routeName: nameof(GetProductionStageEntriesByID),routeParamName:"id" );
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpPut("{id}", Name = "UpdateProductionStageEntriesByID")]
public async Task<ActionResult> UpdateProductionStageEntriesByID(
    int id, [FromBody] ProductionStageEntriesUpdateDTO dto,
    CancellationToken cancellationToken)  
{  
      dto.ID=id;

    var result = await ProductionStageEntriesService.UpdateProductionStageEntriesByIDAsync(
      dto,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpDelete("{id}", Name = "DeleteProductionStageEntriesByID")]
public async Task<ActionResult> DeleteProductionStageEntriesByID(
    int id, CancellationToken cancellationToken)
{

    var result = await ProductionStageEntriesService.DeleteProductionStageEntriesByIDAsync(
        id
        , cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)] 
[HttpGet("SearchProductionStageEntries")]
public async Task<ActionResult> SearchProductionStageEntries(
   [FromQuery]   SearchProductionStageEntriesRequest   request ,
    CancellationToken cancellationToken)
{
    var result = await ProductionStageEntriesService.SearchProductionStageEntries(
        request.OrderID, request.OrderStageID, request.StageID,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
 [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
[HttpGet("{id}", Name = "GetProductionStageEntriesByID")]
public async Task<ActionResult> GetProductionStageEntriesByID(
    int id,
    CancellationToken cancellationToken)
{
    var result = await ProductionStageEntriesService.GetProductionStageEntriesByIDAsync(
        id,
        cancellationToken);

    return ApiResponseHelper.GenerateApiResponse(this, result.ErrorType, result);
}
}

