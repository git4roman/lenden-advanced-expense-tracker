using Lenden.Application.Interfaces.Services;
using Lenden.Application.Managers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lenden.Web.Controllers.API
{
    [Route("api/v1/friendship")]
    [ApiController]
    [Authorize]
    public class FriendshipApiController : ControllerBase
    {
        private readonly IFriendshipService _friendshipService;
        private readonly IAuthService _authService;
        public FriendshipApiController(IFriendshipService friendshipService, IAuthService authService)
        {
            _friendshipService = friendshipService;
            _authService = authService;
        }
        
        [HttpGet()]
        public async Task<IActionResult> GetFriends(CancellationToken ct = default)
        {
            try
            {
                var currentUser = await _authService.ValidateUserAsync(User, ct);
                var friends = await _friendshipService.GetFriendsAsync(currentUser.Id);
                var result = friends.Select(f => new FriendDto
                {
                    Id = f.PublicId,
                    GivenName = f.GivenName,
                    FamilyName = f.FamilyName,
                    Email = f.Email.Value
                });

                return Ok(result);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
        
        private class FriendDto
        {
            public Guid Id { get; set; }
            public string GivenName { get; set; }
            public string FamilyName { get; set; }
            public string Email { get; set; }
        }
    }
}
