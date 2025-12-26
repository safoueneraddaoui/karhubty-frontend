# Email Verification Setup for KarHubty

This guide explains how to set up email verification for user account creation.

## Features

- Users receive a confirmation email when they create an account
- Email contains a verification link that expires after 24 hours
- Users can only login after verifying their email
- Clicking the verification link redirects to the login page

## Backend Setup

### 1. Install Dependencies

```bash
npm install @nestjs-modules/mailer nodemailer
```

### 2. Environment Variables

Add the following to your `.env` file:

```
# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@karhubty.com

# Frontend URL for verification links
FRONTEND_URL=http://localhost:3000
```

### 3. Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password as `EMAIL_PASSWORD` in `.env`

### 4. Database Migration

Run the migration to add email verification columns:

```bash
npm run typeorm migration:run
```

This adds:
- `isEmailVerified` - Boolean flag (default: false)
- `emailVerificationToken` - Verification token
- `emailVerificationTokenExpires` - Token expiration timestamp

### 5. API Endpoints

**Register User:**
```bash
POST /api/auth/register/user
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to verify your account."
}
```

**Verify Email:**
```bash
GET /api/auth/verify-email/:token
```

## Frontend Setup

### 1. Verify Email Page

A new page `VerifyEmailPage.js` has been created at:
```
src/pages/VerifyEmailPage.js
```

This page:
- Accepts a token from the URL: `/verify-email/:token`
- Shows a loading state while verifying
- Shows success/error messages
- Redirects to login after successful verification

### 2. Route Configuration

The route is already added to `App.js`:
```javascript
<Route path="/verify-email/:token" element={<VerifyEmailPage />} />
```

## How It Works

### User Registration Flow:

1. User fills out registration form and submits
2. Backend creates user with `isEmailVerified: false`
3. Backend generates a random verification token (valid for 24 hours)
4. Backend sends email with verification link
5. User receives email with link: `http://localhost:3000/verify-email/:token`
6. User clicks link or pastes it in browser

### Email Verification Flow:

1. Frontend `VerifyEmailPage` extracts token from URL
2. Frontend sends GET request to `/api/auth/verify-email/:token`
3. Backend validates token and expiration
4. Backend marks user as `isEmailVerified: true`
5. Backend clears the verification token
6. Frontend shows success message and redirects to login
7. User can now login with their credentials

### Login Validation:

When user attempts to login:
1. Backend checks if `isEmailVerified: true`
2. If false, returns: "Please verify your email before logging in"
3. If true, allows login and returns JWT token

## Email Template

The verification email contains:

```html
<h2>Welcome to KarHubty!</h2>
<p>Thank you for registering. Please verify your email to activate your account.</p>
<p>
  <a href="http://localhost:3000/verify-email/{token}">
    Verify Email
  </a>
</p>
<p>This link will expire in 24 hours.</p>
```

You can customize this in `src/auth/auth.service.ts` in the `registerUser` method.

## Testing

### 1. Test Registration

```bash
curl -X POST http://localhost:8080/auth/register/user \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "city": "New York"
  }'
```

### 2. Verify Email (use the token from the email)

```bash
curl http://localhost:8080/auth/verify-email/{token}
```

### 3. Try Login Before Verification

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return: "Please verify your email before logging in"

### 4. Try Login After Verification

Same request as step 3 should now succeed.

## Troubleshooting

### Email Not Sending

1. Check your email credentials in `.env`
2. Check if EMAIL_PORT is correct (usually 587 for TLS)
3. Check Gmail settings if using Gmail
4. Check backend logs for error messages

### Token Not Found/Expired

- Tokens expire after 24 hours
- User needs to register again to get a new token
- Consider adding a "Resend Verification Email" feature

### Migration Issues

If migration fails:
1. Check database connection
2. Ensure TypeORM is configured correctly
3. Check TypeORM logging in `ormconfig.json`

## Future Enhancements

1. Add "Resend Verification Email" endpoint
2. Add email verification status in user profile
3. Auto-delete unverified users after 48 hours
4. Add SMS verification as alternative
5. Add passwordless login via email link

## Security Notes

- Tokens are random 64-character hex strings
- Tokens are stored in database (not user password)
- Tokens expire after 24 hours
- Always use HTTPS in production for email links
- Use strong email password (ideally App-specific password)

