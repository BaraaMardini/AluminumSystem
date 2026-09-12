using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/statusess")]
[ApiController]
public class StatusesController : ControllerBase
{
    // =====================================================
    // VIEW = 1073741824
    // =====================================================

    [HasPermission(1073741824)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllStatuses")]
    public async Task<ActionResult> GetAllStatuses(
        CancellationToken cancellationToken)
    {
        var result = await StatusesService.GetAllStatusesAsync(
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 536870912
    // =====================================================

    [HasPermission(536870912)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddStatuses")]
    public async Task<ActionResult> AddStatuses(
        [FromBody] StatusesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await StatusesService.AddStatusesAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetStatusesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 2147483648
    // =====================================================

    [HasPermission(2147483648)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateStatusesByID")]
    public async Task<ActionResult> UpdateStatusesByID(
        int id,
        [FromBody] StatusesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await StatusesService.UpdateStatusesByIDAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 1073741824
    // =====================================================

    [HasPermission(1073741824)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetStatusesByID")]
    public async Task<ActionResult> GetStatusesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await StatusesService.GetStatusesByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}