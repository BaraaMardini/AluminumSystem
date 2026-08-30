using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;

[Authorize]
[Route("api/userss")]
[ApiController]
public class UsersController : ControllerBase
{
    // =====================================================
    // VIEW = 2
    // =====================================================

    [HasPermission(2)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("all", Name = "GetAllUsers")]
    public async Task<ActionResult> GetAllUsers(
        CancellationToken cancellationToken)
    {
        var result = await UsersService.GetAllUsersAsync(
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // CREATE = 1
    // =====================================================

    [HasPermission(1)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPost(Name = "AddUsers")]
    public async Task<ActionResult> AddUsers(
        [FromBody] UsersDTO dto,
        CancellationToken cancellationToken)
    {
        var result = await UsersService.AddUsersAsync(
            dto,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result,
            newID: result.Data?.ID,
            routeName: nameof(GetUsersByID),
            routeParamName: "id");
    }


    // =====================================================
    // UPDATE
    // =====================================================


    // =====================================================
    // UPDATE PASSWORD
    // Email + OldPassword + NewPassword
    // =====================================================

    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpPut("update-password", Name = "UpdateUserPassword")]
    public async Task<ActionResult> UpdateUserPassword(
        [FromBody] UsersUpdateDTO dto,
        CancellationToken cancellationToken)
    {
        var result =
            await UsersService.UpdateUserPasswordAsync(
                dto,
                cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 2
    // =====================================================

    [HasPermission(2)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("SearchUsers")]
    public async Task<ActionResult> SearchUsers(
        [FromQuery] SearchUsersRequest request,
        CancellationToken cancellationToken)
    {
        var result = await UsersService.SearchUsers(
            request.ID,
            request.UserName,
            request.IsActive,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }


    // =====================================================
    // VIEW = 2
    // =====================================================

    [HasPermission(2)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [HttpGet("{id}", Name = "GetUsersByID")]
    public async Task<ActionResult> GetUsersByID(
        int id,
        CancellationToken cancellationToken)
    {
        var result = await UsersService.GetUsersByIDAsync(
            id,
            cancellationToken);

        return ApiResponseHelper.GenerateApiResponse(
            this,
            result.ErrorType,
            result);
    }
}