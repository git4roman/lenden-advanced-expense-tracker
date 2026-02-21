namespace Lenden.Application.Interfaces.Validators;

public interface IGroupValidators
{
    Task EnsureUserInGroupAndActiveAsync(Guid groupId, Guid userId);
}