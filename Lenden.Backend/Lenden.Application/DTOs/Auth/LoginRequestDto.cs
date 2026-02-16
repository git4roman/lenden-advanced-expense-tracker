using System.ComponentModel.DataAnnotations;

namespace Lenden.Application.DTOs;


public record LoginRequestDto(
    [Required][EmailAddress] string Email,
    [Required] string Password,
    string deviceInfo,
        string ipAddress
);