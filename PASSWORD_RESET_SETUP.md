# Password Reset Setup Guide

## Overview
This guide explains how to set up the password reset functionality with email notifications using nodemailer.

## Email Configuration

### 1. Gmail Setup (Recommended)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password

### 2. Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Database (use either one)
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin Email (for application notifications)
ADMIN_EMAIL=admin@yourcompany.com

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Free Email Services

### Nodemailer is FREE! ✅
- Nodemailer is completely free to use
- You only pay for the email service provider (Gmail, Outlook, etc.)

### Free Email Service Options:

1. **Gmail** (Recommended)
   - Free up to 500 emails/day
   - Easy setup with App Passwords
   - Reliable delivery

2. **Outlook/Hotmail**
   - Free with Microsoft account
   - Good delivery rates
   - Similar setup to Gmail

3. **Yahoo Mail**
   - Free service
   - Requires App Password setup

4. **SendGrid** (Free Tier)
   - 100 emails/day free
   - Professional email service
   - Better for production apps

5. **Mailgun** (Free Tier)
   - 5,000 emails/month free
   - Good for production apps

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install nodemailer @types/nodemailer
   ```

2. **Configure Environment Variables**
   - Copy the example above to `.env.local`
   - Replace with your actual values

3. **Test the Setup**
   - Start your development server
   - Go to `/auth/forgot-password`
   - Enter an email address
   - Check if the email is received

## Security Features

- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32 bytes random)
- Passwords are hashed with bcrypt
- No information leakage about user existence
- Secure email templates

## Troubleshooting

### Email Not Sending
1. Check your Gmail App Password
2. Ensure 2FA is enabled on Gmail
3. Check spam folder
4. Verify environment variables

### Token Issues
1. Ensure MongoDB is connected
2. Check token expiration (1 hour)
3. Verify token format

## Production Considerations

1. **Use a Professional Email Service**
   - SendGrid, Mailgun, or AWS SES
   - Better delivery rates
   - Higher limits

2. **Environment Variables**
   - Use proper production URLs
   - Secure email credentials

3. **Rate Limiting**
   - Implement rate limiting for forgot password requests
   - Prevent abuse

4. **Monitoring**
   - Monitor email delivery rates
   - Track failed password resets 