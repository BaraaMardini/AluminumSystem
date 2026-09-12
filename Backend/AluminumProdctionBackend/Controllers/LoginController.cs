using Microsoft.AspNetCore.Mvc;
using BackendHospital.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.RateLimiting;
using System.Runtime.InteropServices;


[Route("api/LoginRequest")]
[ApiController]
[EnableRateLimiting("AuthLimiter")]
public class LoginController : ControllerBase
{
    private readonly IConfiguration _configuration;




    public LoginController(
        IConfiguration configuration
     )
    {
        _configuration = configuration;
    }


  



    // =====================================================
    // LOGIN
    // =====================================================

    [ProducesResponseType(
        typeof(TokenResponse),
        StatusCodes.Status200OK)]

    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]

    [ProducesResponseType(
        StatusCodes.Status500InternalServerError)]

    [HttpPost("Login")]
 

    public async Task<ActionResult<TokenResponse>> LoginRequest(
        [FromBody] LoginRequest dto,
        CancellationToken cancellationToken)
    {
        // =================================================
        // Validate User + Password
        // =================================================

        var result =
            await LoginService.Login(
                dto,
                cancellationToken);


        // =================================================
        // Database Error
        // =================================================

        if (result.ErrorType ==
            ErrorType.DatabaseError)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                result);
        }

        // =================================================
        // Invalid Credentials

        // =================================================

        if (result.ErrorType != ErrorType.None)
        {


            return Unauthorized("Invalid username or password.");
        }


      

        // =================================================
        // Create Access Token
        // =================================================

        var accessToken =
            CreateAccessToken(
                result.Data);


        // =================================================
        // Return Tokens
        // =================================================

        return Ok(
            new TokenResponse
            {
                AccessToken =
                    accessToken,

            });

    }
    private string CreateAccessToken(
     UserInfo user)
    {
        var claims =
            new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserID.ToString()),

                new Claim(
                    ClaimTypes.Email,
                    user.Email ?? string.Empty),

                new Claim(
                    ClaimTypes.Role,
                    user.Role ?? string.Empty),

                new Claim(
                    "PermissionMask",
                    user.PermissionMask.ToString()),

             
            };


        // =================================================
        // Read JWT Configuration
        // =================================================

        var jwtKey =
            _configuration["Jwt:Key"];

        var jwtIssuer =
            _configuration["Jwt:Issuer"];

        var jwtAudience =
            _configuration["Jwt:Audience"];


        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT key is not configured.");
        }


        if (string.IsNullOrWhiteSpace(jwtIssuer))
        {
            throw new InvalidOperationException(
                "JWT issuer is not configured.");
        }


        if (string.IsNullOrWhiteSpace(jwtAudience))
        {
            throw new InvalidOperationException(
                "JWT audience is not configured.");
        }


        // =================================================
        // Security Key
        // =================================================

        var key =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    jwtKey));


        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);


        // =================================================
        // Create JWT
        // =================================================

        var token =
            new JwtSecurityToken(
                issuer:
                    jwtIssuer,

                audience:
                    jwtAudience,

                claims:
                    claims,

                notBefore:
                    DateTime.UtcNow,

                expires:
                    DateTime.UtcNow.AddMinutes(500),

                signingCredentials:
                    credentials);


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }



}