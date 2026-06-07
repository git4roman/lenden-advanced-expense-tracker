using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lenden.Domain.ValueObjects
{
    public class Receipt
    {
        public string Large { get; private set; }
        public string Original { get; private set; }
        private Receipt() { }
        public Receipt(string large, string original)
        {
            Large = large;
            Original = original;
        }
    }
}
