using System.Security.Claims;
using Lenden.Application.DTOs;
using Lenden.Application.DTOs.Auth;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Repositories;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;
using IUserRepository = Lenden.Application.Interfaces.IUserRepository;

namespace Lenden.Application.Services;

public class AuthService: IAuthService
{
    private readonly TokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher<UserEntity> _passwordHasher;
    
    public AuthService( TokenService tokenService, IUnitOfWork unitOfWork, IPasswordHasher<UserEntity> passwordHasher)
    {
       
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
        if (user == null) throw new Exception("User not found.");
        
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
            throw new Exception("Invalid credentials");
        
        
        var (accessToken,expiresAt) = await _tokenService.DispatchAccessToken(user);
        var refreshToken = await _tokenService.DispatchRefreshToken(user);
        
        var session = new AuthResponseDto(accessToken, refreshToken, expiresAt, user.Slug);
        user.AddAuthSession(refreshToken, dto.deviceInfo, dto.ipAddress, expiresAt);
        await _unitOfWork.SaveChangesAsync();
        
        return session;
    }
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(dto.Email);
        if (user != null) throw new Exception("User already exists.");
        
        var entity = new UserEntity(Email.Create(dto.Email), dto.FirstName, dto.LastName, dto.Password);
        var hashedPassword = _passwordHasher.HashPassword(entity, dto.Password);
        entity.SetPassword(hashedPassword);
        entity.CreateUserInfo( dto.Address, dto.PhoneNumber, dto.ImageUrl ,dto.DateOfBirth);
        await _unitOfWork.UserRepository.CreateUserAsync(entity);
        
        var (accessToken,expiresAt) = await _tokenService.DispatchAccessToken(entity);
        var refreshToken = await _tokenService.DispatchRefreshToken(entity);
        
        var session = new AuthResponseDto(accessToken, refreshToken, expiresAt, entity.Slug);
        entity.AddAuthSession(refreshToken, dto.deviceInfo, dto.ipAddress, expiresAt);
        
        await _unitOfWork.SaveChangesAsync();
        
        return session;
    }
    
    public async Task<AuthResponseDto?> RefreshTokenAsync(UserEntity user,RefreshTokenRequest request)
    {
       
        var hashedToken = AuthSessionEntity.HashToken(request.RefreshToken);
        
        AuthSessionEntity session = user.Sessions.FirstOrDefault(s => s.RefreshTokenHash == hashedToken);
        if (session == null || !session.IsActive())
            return null;
        
        request.User.RevokeAllSessions();
        
        var (accessToken,expiresAt) = await _tokenService.DispatchAccessToken(request.User);
        var refreshToken = await _tokenService.DispatchRefreshToken(request.User);
        
        
        var newRefreshToken = Guid.NewGuid().ToString();
        request.User.AddAuthSession(
            refreshToken: newRefreshToken,
            deviceInfo: request.DeviceInfo,
            ipAddress: request.IpAddress,
            expiresAt: DateTime.UtcNow.AddDays(7)
        );
        
        await _unitOfWork.SaveChangesAsync();
        
        return new AuthResponseDto(accessToken, refreshToken,expiresAt, request.User.Slug);
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

    public async Task ResetPassword(UserEntity user, ResetPasswordRequestDto request)
    {
        var newPassword = _passwordHasher.HashPassword(user, request.Password);
        user.SetPassword(newPassword);
        await _unitOfWork.UserRepository.UpdateUserAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ForgetPassword(ForgetPasswordRequest request)
    {
        var user = await _unitOfWork.UserRepository.GetUserByEmailAsync(request.Email);
        if (user is null) throw new UnauthorizedAccessException("User does not exist");
        var newPassword = _passwordHasher.HashPassword(user, request.Password);
        user.SetPassword(newPassword);
        await _unitOfWork.UserRepository.UpdateUserAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ChangePassword(UserEntity user, ChangePasswordRequestDto request)
    {
        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword);
        if (result == PasswordVerificationResult.Failed)
            throw new Exception("Invalid credentials");
        var newPassword = _passwordHasher.HashPassword(user, request.NewPassword);
        user.SetPassword(newPassword);
        await _unitOfWork.UserRepository.UpdateUserAsync(user);
        await _unitOfWork.SaveChangesAsync();

    }

    public async Task<AuthResponseDto?> GoogleHandlerAsync(GoogleLoginDto request)
    {
        var existingUser = await _unitOfWork.UserRepository.GetUserByEmailAsync(request.Email);
        if(existingUser is null)
        {
            var registerDto = new RegisterRequestDto(
                Email: request.Email,
                Password: Guid.NewGuid().ToString(),
                FirstName: request.GivenName ?? "",
                LastName: request.FamilyName ?? " ",
                Address: null ?? " ",
                PhoneNumber: null ?? " ",
                DateOfBirth: DateTime.MinValue, 
                ImageUrl: request.PhotoUrl ?? "",
                deviceInfo: request.DeviceInfo??"",
                ipAddress: request.IpAddress??""
            );
            var session = await RegisterAsync(registerDto);
            return session;
        }
      else{
            var (accessToken,expiresAt) = await _tokenService.DispatchAccessToken(existingUser);
            var refreshToken = await _tokenService.DispatchRefreshToken(existingUser);
        
            var session = new AuthResponseDto(accessToken, refreshToken, expiresAt, existingUser.Slug);
            existingUser.AddAuthSession(refreshToken, request.DeviceInfo, request.IpAddress, expiresAt);
            await _unitOfWork.SaveChangesAsync();
        
            return session;
        }
    }

    
}