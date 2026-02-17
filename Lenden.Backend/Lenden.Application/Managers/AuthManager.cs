using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Lenden.Application.Interfaces;
using Lenden.Domain.Entities;

namespace Lenden.Application.Managers;

public class AuthManager
{
    private readonly IUnitOfWork _unitOfWork;

    public AuthManager(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    public async Task<UserEntity> ValidateUserAsync(ClaimsPrincipal userClaims, CancellationToken ct = default)
    {
        if (userClaims?.Identity?.IsAuthenticated != true)
            throw new UnauthorizedAccessException("User is not authenticated.");

        var userIdClaim = userClaims.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            throw new UnauthorizedAccessException("Invalid user token.");

        var user = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(userId, ct);
        if (user == null || user.Status != UserStatus.Active)
            throw new UnauthorizedAccessException("User not found or inactive.");

        return user;
    }
 
}