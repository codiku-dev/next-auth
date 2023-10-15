# Next auth

## ENV

NEXTAUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:kdaklzkjkajsazdzad@db.abscfhjsvhyfcbnddmwq.supabase.co:5432/postgres

NEXTAUTH_SECRET=6rM9SG9Jtx3Ij5Wp2O3n5Yg3hTfN6CpDqD5ZsItJ7hCfWm9WdUaV3ZqD1SgXrHtKs

SMTP_USER=apikey
SMTP_PASSWORD=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

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_FROM=robin.lebhar.chill.studio@gmail.com

SIGNUP_CALLBACK_URL=http://localhost:3000
FORGOT_PASSWORD_CALLBACK_URL=http://localhost:3000/auth/reset-password

## Toast and response

By default axios-config display alerts. Unless you send isToastDisabled:false in header

## Route Protection

Pages :

See middleware.ts to protect a page

Api routes :

Just wrap your handler with auth() hoc, (you can send true or false as second param to enable/disabled)

## Session

To make sure you have access to the session, use withSession

## Crud

`npm run crud`

will create GET,POST,PATCH,DELETE, a prisma schema, a zod prisma schema.
