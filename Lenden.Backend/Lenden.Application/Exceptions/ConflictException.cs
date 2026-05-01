namespace Lenden.Web.Models.Exceptions;

public class ConflictException : AppException
{
    public ConflictException(string message)
        : base(message, 409) { }
}