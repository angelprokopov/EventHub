using System.Net;
using System.Net.Mail;

namespace EventHub.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _conf;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration conf, ILogger<EmailService> logger)
        {
            _conf = conf;
            _logger = logger;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var host = _conf["Smtp:Host"];
            var port = int.Parse(_conf["Smtp:Port"] ?? "587");
            var enableSsl = bool.Parse(_conf["Smtp:EnableSsl"] ?? "true");
            var user = _conf["Smtp:User"];
            var password = _conf["Smtp:Password"];
            var from = _conf["Smtp:From"];

            if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(password))
            {
                _logger.LogError("SMTP configuration missing or invalid.");
                throw new InvalidOperationException("SMTP configuration missing.");
            }

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, password),
                EnableSsl = enableSsl
            };

            if (string.IsNullOrWhiteSpace(from))
            {
                from = user;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(from),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(to);

            try
            {
                await client.SendMailAsync(message);
            }
            catch (Exception e)
            {
                _logger.LogError($"Error sending mail to {to} {e}");
                throw;
            }
        }
    }
}
