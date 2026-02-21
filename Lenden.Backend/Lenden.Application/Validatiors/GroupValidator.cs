using Lenden.Application.Interfaces;
using Lenden.Application.Interfaces.Validators;

namespace Lenden.Application.Validatiors;

public class GroupValidator: IGroupValidators
{
    private readonly IUnitOfWork _unitOfWork;
    public GroupValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task EnsureUserInGroupAndActiveAsync(Guid groupId, Guid userId)
    {
        await _unitOfWork.UserGroupRepository.EnsureUserInGroupAndActiveAsync(groupId, userId);
    }
}