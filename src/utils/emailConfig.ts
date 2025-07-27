import nodemailer from 'nodemailer';

// Email configuration for different providers
const emailConfigs = {
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  outlook: {
    service: 'outlook',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  yahoo: {
    service: 'yahoo',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  },
  mailgun: {
    host: process.env.MAILGUN_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS,
    },
  },
};

// Get the email provider from environment variable or default to gmail
const getEmailProvider = () => {
  return process.env.EMAIL_PROVIDER || 'gmail';
};

// Create transporter based on provider
export const createTransporter = () => {
  const provider = getEmailProvider();
  const config = emailConfigs[provider as keyof typeof emailConfigs];
  
  if (!config) {
    throw new Error(`Unsupported email provider: ${provider}`);
  }
  
  return nodemailer.createTransport(config);
};

// Send email function
export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: options.from || process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };
  
  return await transporter.sendMail(mailOptions);
};

// Email templates
export const emailTemplates = {
  passwordReset: (userName: string, resetUrl: string) => ({
    subject: 'Password Reset Request - Prime HR Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h2 style="color: #333; margin: 0;">Prime HR Solutions</h2>
        </div>
        <div style="padding: 30px; background-color: white;">
          <h3 style="color: #333; margin-bottom: 20px;">Password Reset Request</h3>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${userName},
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Prime HR Solutions account. 
            Click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          <p style="color: #3b82f6; word-break: break-all; margin-bottom: 20px;">
            ${resetUrl}
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email from Prime HR Solutions. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  }),
  
  newApplicationNotification: (applicationData: {
    applicantName: string;
    applicantEmail: string;
    applicantPhone: string;
    jobTitle: string;
    company: string;
    location: string;
    appliedAt: string;
    viewApplicationUrl: string;
  }) => ({
    subject: 'New Job Application Received - Prime HR Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Job Application Received</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Prime HR Solutions</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
          <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
            Hello Admin! A new job application has been submitted and requires your attention.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Application Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold; width: 120px;">Applicant:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.applicantName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.applicantEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.applicantPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Position:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Company:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Location:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Applied:</td>
                <td style="padding: 8px 0; color: #333;">${applicationData.appliedAt}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${applicationData.viewApplicationUrl}" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
              View Application
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Click the button above to review the application, download the resume, and update the application status.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e1e5e9; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
            This email was sent from Prime HR Solutions. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  }),
}; 