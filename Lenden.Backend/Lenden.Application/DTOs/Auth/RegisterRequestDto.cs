using System.ComponentModel.DataAnnotations;

namespace Lenden.Application.DTOs;

public record RegisterRequestDto(
    [Required][EmailAddress] string Email,
    [Required][MinLength(6)] string Password,
    string? FirstName,
    string? LastName,
    string? Address,
    string? PhoneNumber,
    DateTime DateOfBirth,
    string? ImageUrl,
    string deviceInfo,
    string ipAddress
);