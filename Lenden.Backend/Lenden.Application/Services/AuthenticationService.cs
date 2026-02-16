using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;
using Lenden.Domain.ValueObject;

namespace Lenden.Application.Services;

public class AuthenticationService: IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly TokenService _tokenService;
    
    public AuthenticationService(IUserRepository userRepository, TokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetUserByEmailAsync(dto.Email);
        if (user == null) return null;
        var accessToken = _tokenService.GenerateToken(user);
        
        var refreshToken = Guid.NewGuid().ToString(); 
        var session = new UserSessionEntity(
            userId: user.Id,
            refreshTokenHash: refreshToken,
            deviceInfo: dto.deviceInfo,
            ipAddress: dto.ipAddress,
            expiresAt: DateTime.UtcNow.AddDays(7) 
        );
        await _userRepository.AddSessionAsync(session);
        var authResponse =new AuthResponse(accessToken, refreshToken);

        return authResponse;

    }

    public async Task RegisterAsync(RegisterRequestDto dto)
    {

        var entity = new UserEntity(Email.Create(dto.Email), dto.FirstName, dto.LastName, dto.Password);
        await _userRepository.CreateUserAsync(entity);
        return;
    }
}