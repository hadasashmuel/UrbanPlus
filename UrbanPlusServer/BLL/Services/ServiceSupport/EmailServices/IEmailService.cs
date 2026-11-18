using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Services.ServiceSupport.EmailServices
{
    public interface IEmailService
    {
        void SendWelcomeEmail(string email, string firstName);
       void SendUserDeletedEmail( string email,  string firstName, string reason);
        Task SendEventStatusEmailAsync(string email,string firstName, string eventTitle, string newStatus);
    }
}
