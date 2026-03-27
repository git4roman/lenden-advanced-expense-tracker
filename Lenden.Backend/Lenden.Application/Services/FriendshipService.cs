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

    public async Task AddFriendAsync(long userId, Guid friendId)
    {
        var friend = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(friendId);
        if (friend == null) throw new Exception("User not found");
        
        var friendship = new FriendshipEntity(userId, friend.Id);
        await _unitOfWork.FriendshipRepository.AddFriendAsync(friendship);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AcceptFriendRequestAsync(long userId, Guid friendId)
    {
        var friend = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(friendId);
        if (friend == null) throw new Exception("User not found");
        var friendship = await _unitOfWork.FriendshipRepository.GetFriendshipAsync(userId,friend.Id);
        if (friendship is null) throw new Exception("Friendship not found");
        friendship.AcceptFriendRequest();
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveFriendAsync(long userId, Guid friendId)
    {
        var friend = await _unitOfWork.UserRepository.GetUserByPublicIdAsync(friendId);
        if (friend == null) throw new Exception("User not found");
        var friendship = await _unitOfWork.FriendshipRepository.GetFriendshipAsync(userId,friend.Id);
        if (friendship is null) throw new Exception("Friendship not found");
        friendship.RejectFriendRequest();
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<bool> IsFriendAsync(long userId, Guid friendId)
    {
        throw new NotImplementedException();
    }
}