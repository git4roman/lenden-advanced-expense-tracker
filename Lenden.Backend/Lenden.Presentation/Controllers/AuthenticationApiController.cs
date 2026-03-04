using Lenden.Application.DTOs;
using Lenden.Application.Interfaces.Services;
using Lenden.Infrastructure.Persistence.DbContexts;

using Microsoft.AspNetCore.Mvc;

namespace Lenden.Presentation.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthenticationApiController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthenticationApiController( IAuthService _authService)
        {
            this._authService = _authService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            AuthResponseDto token =await _authService.LoginAsync(request);
            return Ok(token);
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            var token =await _authService.RegisterAsync(request);
            return Ok(token);
        }
        
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest request)
        {
            var tokens = await _authService.RefreshTokenAsync(request);
            if (tokens == null)
                return Unauthorized("Invalid or expired refresh token");

            return Ok(tokens);
        }

    }
    }

