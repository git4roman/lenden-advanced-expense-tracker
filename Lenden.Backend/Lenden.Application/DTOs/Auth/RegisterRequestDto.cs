using System.ComponentModel.DataAnnotations;

namespace Lenden.Application.DTOs;

public record RegisterRequestDto(
    [Required][EmailAddress] string Email,
    [Required][MinLength(6)] string Password,
    string? FirstName,
    string? LastName,
    string deviceInfo,
    string ipAddress
);