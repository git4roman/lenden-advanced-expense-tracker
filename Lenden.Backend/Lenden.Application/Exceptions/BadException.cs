namespace Lenden.Web.Models.Exceptions;


public class BadRequestException : AppException
{
    public BadRequestException(string message)
        : base(message, 400) { }
}