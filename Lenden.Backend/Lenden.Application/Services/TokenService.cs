
using Lenden.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Lenden.Application.DTOs;
using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;

using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Lenden.Application.Services;

public class TokenService
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;

    public TokenService(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
    }

    public string GenerateToken(UserEntity user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Slug.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email.Value),
            new Claim("role", user.Role.Name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    // public async Task<AuthResponseDto> DispatchAccessAndRefreshToken(UserEntity user, AuthRequest request)
    // {
    //     var accessToken = GenerateToken(user);
    //     
    //     user.AddAuthSession(
    //         refreshToken: refreshToken,
    //         deviceInfo: request.deviceInfo,
    //         ipAddress: request.ipAddress,
    //         expiresAt: DateTime.UtcNow.AddDays(7) 
    //     );
    //     
    //     var authresponse = new AuthResponseDto(accessToken, refreshToken);
    //     
    //     return authresponse;
    // }
    
    public async  Task<(string, DateTime)> DispatchAccessToken(UserEntity user)
    {
        var accessToken = GenerateToken(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(15);
        
        return (accessToken, expiresAt);
    }
    public async Task<string> DispatchRefreshToken(UserEntity user)
    {
        user.RevokeAllSessions();
        var refreshToken = Guid.NewGuid().ToString(); 
        return refreshToken;
    }
}
