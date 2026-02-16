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
        private readonly AppDbContext _context;
        public AuthenticationApiController(AppDbContext _context, IAuthService _authService)
        {
            this._context = _context;
            this._authService = _authService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var token =await _authService.LoginAsync(request);
            return Ok(token);
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _authService.RegisterAsync(request);
            return Ok();
        }
    }
    }

