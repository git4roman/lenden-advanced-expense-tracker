using Ardalis.SmartEnum;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Lenden.Domain.Entities;

public class SmartEnumConverter<TEnum> 
    : ValueConverter<TEnum, int>
    where TEnum : SmartEnum<TEnum, int>
{
    public SmartEnumConverter()
        : base(
            v => v.Value,
            v => SmartEnum<TEnum, int>.FromValue(v))
    { }
}