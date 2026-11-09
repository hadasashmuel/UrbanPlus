using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Exceptions
{
    public class DataAnnotations : Exception
    {
        public DataAnnotations() : base() { }
        public DataAnnotations(string message) : base(message) { }
        public DataAnnotations(string message, Exception innerException) : base(message, innerException) { }
    }
}
