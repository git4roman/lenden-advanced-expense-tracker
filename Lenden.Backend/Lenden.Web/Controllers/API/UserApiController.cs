using Lenden.Application.Interfaces.Services;
using Lenden.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API
{
    [Authorize]
    [Route("api/v1/users")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        public UserApiController(IAuthService authService, IUserService userService)
        {
            _authService= authService;
            _userService = userService;
        }
        
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUserInfo()
        {
            var currentUser = await _authService.ValidateUserAsync(User);
            if (currentUser == null) return Unauthorized();
            var user = await _userService.GetUserByIdAsync(currentUser.Id);
            return Ok(user);
        }
    }
}
