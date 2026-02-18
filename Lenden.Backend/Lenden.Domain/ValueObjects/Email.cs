namespace Lenden.Domain.ValueObjects;

public sealed record Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            throw new ArgumentException("Email cannot be empty.");

        var normalized = input.Trim().ToLowerInvariant();

        if (!IsValid(normalized))
            throw new ArgumentException("Invalid email format.");

        return new Email(normalized);
    }

    private static bool IsValid(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public override string ToString() => Value;
}
