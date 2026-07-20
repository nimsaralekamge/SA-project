using System;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace TalentFlow.API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendResetPasswordEmailAsync(string toEmail, string resetLink)
        {
            var smtpServer = _config["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            var port = int.Parse(_config["EmailSettings:Port"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var password = _config["EmailSettings:Password"];

            var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, "TalentFlow Support"),
                Subject = "TalentFlow - Password Reset Request",
                Body = $@"
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Click the link below to set a new password:</p>
                    <a href='{resetLink}' style='padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;'>Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>",
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);
            await client.SendMailAsync(mailMessage);
        }

        public async Task SendInterviewScheduledEmailAsync(string toEmail, string candidateName, string role, string pipelineStage, DateTime scheduledTime, int durationMinutes)
        {
            var smtpServer = _config["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            var port = int.Parse(_config["EmailSettings:Port"] ?? "587");
            var senderEmail = _config["EmailSettings:SenderEmail"];
            var password = _config["EmailSettings:Password"];

            var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, "TalentFlow Recruitment"),
                Subject = $"Interview Scheduled: {role} - {pipelineStage}",
                Body = $@"
                    <div style='background-color: #000000; color: #ffffff; font-family: ""Cinzel"", serif, sans-serif; padding: 40px; border: 1px solid #d4af37; border-radius: 8px; max-width: 600px; margin: auto;'>
                        <h2 style='color: #d4af37; text-align: center; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;'>Interview Confirmation</h2>
                        <p style='font-size: 16px; color: #cccccc;'>Hello {candidateName},</p>
                        <p style='font-size: 16px; color: #cccccc;'>Your interview for the <strong>{role}</strong> position has been scheduled. You will be completing the <strong>{pipelineStage}</strong> stage of our process.</p>
                        
                        <div style='background: linear-gradient(145deg, #1a1a1a, #0a0a0a); padding: 20px; border-left: 4px solid #d4af37; margin: 25px 0;'>
                            <p style='margin: 0; font-size: 18px; color: #ffffff;'><strong>Date & Time:</strong> {scheduledTime.ToLocalTime():f}</p>
                        </div>
                        
                        <p style='font-size: 16px; color: #cccccc;'>Please find the attached calendar invite to block this time on your schedule. We look forward to speaking with you.</p>
                        <br/>
                        <p style='font-size: 14px; color: #888888; border-top: 1px solid #333333; padding-top: 10px;'>TalentFlow Talent Acquisition Team</p>
                    </div>",
                IsBodyHtml = true
            };

            // --- NEW LOGIC: Generate the .ics Calendar Attachment ---
            DateTime endTime = scheduledTime.AddMinutes(durationMinutes);
            string icsContent = $@"BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TalentFlow//EN
BEGIN:VEVENT
UID:{Guid.NewGuid()}
DTSTAMP:{DateTime.UtcNow:yyyyMMddTHHmmssZ}
DTSTART:{scheduledTime.ToUniversalTime():yyyyMMddTHHmmssZ}
DTEND:{endTime.ToUniversalTime():yyyyMMddTHHmmssZ}
SUMMARY:TalentFlow Interview: {role}
DESCRIPTION:Interview for the {role} position - {pipelineStage} stage.
END:VEVENT
END:VCALENDAR";

            byte[] icsBytes = System.Text.Encoding.UTF8.GetBytes(icsContent);
            using (var ms = new System.IO.MemoryStream(icsBytes))
            {
                var calendarAttachment = new System.Net.Mail.Attachment(ms, "invite.ics", "text/calendar");
                mailMessage.Attachments.Add(calendarAttachment);

                mailMessage.To.Add(toEmail);
                await client.SendMailAsync(mailMessage);
            }
        }
    }
}