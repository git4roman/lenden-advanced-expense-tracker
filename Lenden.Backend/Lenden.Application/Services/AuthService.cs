using System.Security.Claims;
using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Application.Services;

public class AuthService: IAuthService
{
    private readonly TokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
   
    
    public AuthService( TokenService tokenService, IUnitOfWork unitOfWork)
    {
       
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
        if (user == null) return null;
        var requestDto = new AuthRequest(dto.deviceInfo, dto.ipAddress);
        return await _tokenService.DispatchAccessAndRefreshToken(user,requestDto);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
        if (user != null) throw new Exception("User already exists.");
        var entity = new UserEntity(Email.Create(dto.Email), dto.FirstName, dto.LastName, dto.Password);
        await _unitOfWork.UserRepository.CreateUserAsync(entity);
        var requestDto = new AuthRequest(dto.deviceInfo, dto.ipAddress);
        var session = await _tokenService.DispatchAccessAndRefreshToken(user,requestDto);
        await _unitOfWork.SaveChangesAsync();
        return session;
    }
    
    public async Task<RefreshTokenResponse?> RefreshTokenAsync(RefreshTokenRequest request)
    {
       
        var hashedToken = AuthSessionEntity.HashToken(request.RefreshToken);
        AuthSessionEntity session = await _unitOfWork.AuthRepository
            .GetActiveSessionByRefreshTokenHashAsync(hashedToken);
        if (session == null || !session.IsActive())
            return null;
        
        session.Revoke();

        var user = await _unitOfWork.UserRepository.GetUserByIdAsync(session.UserId);
        if (user == null) return null;

        var newAccessToken = _tokenService.GenerateToken(user);

        var newRefreshToken = Guid.NewGuid().ToString();
        user.AddAuthSession(
            refreshToken: newRefreshToken,
            deviceInfo: request.DeviceInfo,
            ipAddress: request.IpAddress,
            expiresAt: DateTime.UtcNow.AddDays(7)
        );

        await _unitOfWork.SaveChangesAsync();

        return new RefreshTokenResponse(newAccessToken, newRefreshToken);
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