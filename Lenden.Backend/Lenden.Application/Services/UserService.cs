using Lenden.Application.DTOs;
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
            Address = user.UserInfo?.Address ?? "",
            PhoneNumber = user.UserInfo?.PhoneNumber ?? "",
            Username = user.Username,
            MemberSince = user.CreatedAt,
        };
        return response;
    }

    public async Task<decimal> GetOverallBalance(long userId)
    {
        var memberships = await _unitOfWork.GroupRepository.GetMembershipsAsync(userId);
        var balance = memberships.Sum(u => u.NetBalance);
        return balance;
    }

    public async Task UpdateUserProfile(UserUpdateRequestDto requestDto)
    {
        requestDto.User.UpdateName(requestDto.GivenName, requestDto.FamilyName);
        requestDto.User.UpdateUserInfo(requestDto.Address, requestDto.PhoneNumber,requestDto.ImageUrl, requestDto.DateOfBirth);
        await _unitOfWork.UserRepository.UpdateUserAsync(requestDto.User);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<UserEntity> GetUserByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public async Task DeactivateAccount(UserEntity user)
    {
        user.UserStatusChange(UserStatus.Disabled);
        await _unitOfWork.UserRepository.UpdateUserAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    
}