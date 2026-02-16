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

    public async Task<string> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetUserByEmailAsync(dto.Email);
        if (user == null) return null;
        return _tokenService.GenerateToken(user);
        
    }

    public async Task RegisterAsync(RegisterRequestDto dto)
    {

        var entity = new UserEntity(Email.Create(dto.Email), dto.FirstName, dto.LastName, dto.Password);
        await _userRepository.CreateUserAsync(entity);
        return;
    }
}