using Lenden.Domain.Entities;

namespace Lenden.Application.Interfaces.Repositories;

public interface IAuthRepository
{
    Task AddSessionAsync(AuthSessionEntity userSession);
    Task<AuthSessionEntity> GetActiveSessionByRefreshTokenHashAsync(string refreshTokenHash);
}