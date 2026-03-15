using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Services;
using Lenden.Domain.Entities;

namespace Lenden.Application.Services;

public class FriendshipService: IFriendshipService
{
    private readonly IUnitOfWork _unitOfWork;
    public FriendshipService(IUnitOfWork unitOfWork)
    {
        _unitOfWork= unitOfWork;
    }
    public async Task<IEnumerable<UserEntity>> GetFriendsAsync(long userId)
    {
        var friends = await _unitOfWork.FriendshipRepository.GetFriendsAsync(userId);
        return friends;
    }
}