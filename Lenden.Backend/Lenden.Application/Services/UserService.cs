using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class UserService: IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    public UserService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UserResponseDto> GetUserByIdAsync(long userId)
    {
        var user = await _unitOfWork.UserRepository.GetUserWithInfoByIdAsync(userId);
        var response = new UserResponseDto
        {
            Id = user.Slug,
            FamilyName = user.FamilyName,
            GivenName = user.GivenName,
            Email = user.Email.Value,
            Address = user.UserInfo.Address,
            PhoneNumber = user.UserInfo.PhoneNumber,
        };
        return response;
    }

    public async Task<UserEntity> GetUserByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FamilyName { get; set; }
        public string GivenName { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
    }
}