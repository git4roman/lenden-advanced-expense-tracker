using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ardalis.SmartEnum;

namespace Lenden.Domain.Enums
{
    public sealed class CreationMethod : SmartEnum<CreationMethod>
    {
        public static readonly CreationMethod Equal = new(nameof(Equal), 1);
        public static readonly CreationMethod Unequal = new(nameof(Unequal), 2);
        

        private CreationMethod(string name, int value)
            : base(name, value) { }
    }
}
