
using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BLL.Services.ServiceSupport.EmailServices
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService( IConfiguration configuration,  ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public void SendWelcomeEmail(string email, string firstName)
        {
            try
            {
                var senderEmail = _configuration["EmailSettings:SenderEmail"];

                var senderName =_configuration["EmailSettings:SenderName"];

                var password = Environment.GetEnvironmentVariable("AppPassword");

                if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(password))
                {
                    throw new InvalidOperationException( "Email settings are missing.");
                }

                using var message = new MailMessage();

                message.From = new MailAddress(
                    senderEmail,
                    senderName ?? "Urban+",
                    Encoding.UTF8);

                message.To.Add(email);
                message.Subject = "ברוכים הבאים ל-Urban+!";
                message.SubjectEncoding = Encoding.UTF8;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;

                message.Body = $@"
                <div dir='rtl' style='font-family:Arial; background:#f4f6f8; padding:30px;'>
                    <div style='max-width:600px; margin:auto; background:white; padding:30px; border-radius:15px;'>
                        <h1 style='color:#2563eb; text-align:center;'>ברוכים הבאים ל-Urban+!</h1>

                        <h2>שלום {System.Net.WebUtility.HtmlEncode(firstName)} 👋</h2>

                        <p style='font-size:17px; line-height:1.8;'>
                            אנחנו שמחים שהצטרפת לקהילת Urban+!
                        </p>

                        <p style='font-size:16px; line-height:1.8;'>
                            Urban+ מאפשרת לתושבים לדווח על מפגעים במרחב העירוני,
                            לעקוב אחר אירועים ולסייע בשיפור הסביבה שבה כולנו חיים.
                        </p>

                        <p style='font-size:17px; text-align:center; color:#2563eb;'>
                            ביחד הופכים את העיר למקום טוב יותר!
                        </p>

                        <hr />

                        <p style='text-align:center; color:#777;'>
                            צוות Urban+
                        </p>
                    </div>
                </div>";

                using var smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(
                        senderEmail,
                        password),
                    EnableSsl = true
                };

                smtp.Send(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send welcome email to {Email}",
                    email);
            }
        }
    }
}
