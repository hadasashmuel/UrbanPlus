using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServiceSupport.EmailServices
{
    public interface IEmailService
    {
        void SendWelcomeEmail(string email, string firstName);
    }
}
