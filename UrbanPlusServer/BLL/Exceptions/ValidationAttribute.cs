using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Exceptions
{
    public class ValidationAttribute : Exception
    {
        public ValidationAttribute() : base() { }
        public ValidationAttribute(string message) : base(message) { }
        public ValidationAttribute(string message, Exception innerException) : base(message, innerException) { }
    }
}
