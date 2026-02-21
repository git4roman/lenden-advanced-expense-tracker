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
    
    

    

}