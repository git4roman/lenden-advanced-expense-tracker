using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Auth;
using Lenden.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
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
            _authService = authService;
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

        [HttpGet("dashboard-info")]
        public async Task<IActionResult> GetDashboardInfo()
        {
            var currentUser = await _authService.ValidateUserAsync(User);
            if (currentUser == null) return Unauthorized();
            // var user = await _userService.GetUserByIdAsync(currentUser.Id);
            var balance = await _userService.GetOverallBalance(currentUser.Id);

            return Ok(balance);
        }

        [HttpPost("{id:guid}/edit")]
        public async Task<IActionResult> EditUser(UserUpdateRequestDto dto)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                if (currentUser == null) return Unauthorized();
                await _userService.UpdateUserProfile(dto, currentUser.Slug);
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPost("/logout")]
        public async Task<IActionResult> Logout()
        {
            var currentUser = await _authService.ValidateUserAsync(User);
            if (currentUser == null) return Unauthorized();
            await _userService.LogoutAsync(currentUser);

            return Ok();


        }

        [HttpPost("{id:guid}/deactivate")]
        public async Task<IActionResult> DeactivateAccount([FromRoute] Guid id)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                if (currentUser == null) return Unauthorized();
                await _userService.DeactivateAccount(currentUser);
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        [HttpPost("reset-passsword")]
        public async Task<IActionResult> ResetPassword (ResetPasswordRequestDto request)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                if (currentUser == null) return Unauthorized();
                await _authService.ResetPassword(currentUser, request);
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        [HttpPost("change-passsword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User);
                if (currentUser == null) return Unauthorized();
                await _authService.ChangePassword(currentUser, request);
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        [AllowAnonymous]
        [HttpPost("forget-passsword")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordRequest request)
        {
            try
            {
                await _authService.ForgetPassword(request);
                return Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }


    }
}
