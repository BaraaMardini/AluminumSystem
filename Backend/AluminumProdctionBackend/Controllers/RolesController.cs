using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/roless")]
[ApiController]
public class RolesController : ControllerBase
{
    // =====================================================
    // VIEW = 8
    // =====================================================

    [HasPermission(8)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllRoles")]
    public async Task<ActionResult> GetAllRoles(
        CancellationToken cancellationToken)
    {
        var result = await RolesService.GetAllRolesAsync(
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 4
    // =====================================================

    [HasPermission(4)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddRoles")]
    public async Task<ActionResult> AddRoles(
        [FromBody] RolesDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await RolesService.AddRolesAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetRolesByID),
            routeParamName: "id");
    }


    // =====================================================
    // EDIT = 16
    // =====================================================

    [HasPermission(16)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("{id}", Name = "UpdateRolesByID")]
    public async Task<ActionResult> UpdateRolesByID(
        int id,
        [FromBody] RolesUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        dto.ID = id;

        var result = await RolesService.UpdateRolesByIDAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 8
    // =====================================================

    [HasPermission(8)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetRolesByID")]
    public async Task<ActionResult> GetRolesByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await RolesService.GetRolesByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}