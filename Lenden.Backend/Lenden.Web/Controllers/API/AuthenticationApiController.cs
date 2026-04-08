using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Services;
using Lenden.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthenticationApiController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly FirebaseService _firebaseService;
        public AuthenticationApiController( IAuthService _authService, FirebaseService _firebaseService)
        {
            this._authService = _authService;
            this._firebaseService = _firebaseService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            try
            {
                AuthResponseDto response = await _authService.LoginAsync(request);
                if (response == null)
                    return Unauthorized(new { message = "Invalid email or password." });
                
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("google")]
        public async Task<IActionResult> Google(GoogleLoginRequestDto request)
        {
            try
            {
                var decoded = await _firebaseService.VerifyTokenAsync(request.IdToken);
                if (decoded == null)
                    return Unauthorized(new { message = "Invalid Firebase token." });
                var verifiedRequest = new GoogleLoginRequestDto
                {
                    Uid = decoded.Uid,
                    Email = decoded.Claims["email"].ToString(),
                    EmailVerified = (bool)decoded.Claims["email_verified"],
                    GivenName = decoded.Claims.GetValueOrDefault("given_name")?.ToString(),
                    FamilyName = decoded.Claims.GetValueOrDefault("family_name")?.ToString(),
                    PhotoUrl = decoded.Claims.GetValueOrDefault("picture")?.ToString(),
                    IsNewUser = request.IsNewUser 
                };
                var response = await _authService.GoogleHandlerAsync(verifiedRequest);
                return response is not null ? Ok(response) : Unauthorized(new { message = "Invalid email or password." });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            try
            {
                AuthResponseDto response = await _authService.RegisterAsync(request);
                if (response == null)
                    return Unauthorized(new { message = "Invalid email or password." });
                
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest request)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                if (currentUser == null) return Unauthorized();
                var tokens = await _authService.RefreshTokenAsync(currentUser,request);
                if (tokens == null)
                    return Unauthorized("Invalid or expired refresh token");

                return Ok(tokens);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ChangePasswordRequest request)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                await _authService.ResetPassword(currentUser, request);
                return Ok();
            }
            catch (Exception e)
            {
               return BadRequest(e.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordRequest request)
        {
            try
            {
                await _authService.ForgetPassword(request);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
    }

