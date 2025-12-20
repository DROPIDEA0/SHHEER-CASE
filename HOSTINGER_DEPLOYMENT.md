# Hostinger Node.js Deployment Guide

## Quick Fix for Environment Variables Issue

If environment variables from Hostinger dashboard are not being detected, follow these steps:

### Step 1: Create .env file manually on Hostinger

After deployment, use Hostinger File Manager to:

1. Navigate to your project root directory (where `dist/` folder is located)
2. Create a new file named `.env`
3. Add the following content:

```env
DATABASE_URL=mysql://u713123409_shheer_case:YOUR_PASSWORD@127.0.0.1:3306/u713123409_shheer_case
JWT_SECRET=3f9c8e7a1d4b6a0e9c2f5b8d7a6c4e1f0b9a8d5c7e2f4a6b1c9e8d0f5a2
NODE_ENV=production
```

**Replace `YOUR_PASSWORD` with your actual database password!**

### Step 2: Restart the application

After creating the `.env` file, restart your Node.js application from Hostinger dashboard.

### Step 3: Verify

Visit: `https://shheercase.com/api/trpc/debug.checkDb`

You should see: `"status": "connected"`

---

## Build Configuration

| Setting | Value |
|---------|-------|
| Framework preset | Express |
| Branch | main |
| Node version | 22.x |
| Root directory | ./ |
| Entry file | dist/index.js |
| Package manager | pnpm |

## Environment Variables (Dashboard)

Even if dashboard variables don't work, set them anyway as backup:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (usually auto-set) | `3000` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ character string |

## Alternative: Individual Database Variables

If `DATABASE_URL` doesn't work, try individual variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_USER` | `u713123409_shheer_case` |
| `DB_PASSWORD` | Your database password |
| `DB_NAME` | `u713123409_shheer_case` |

## Troubleshooting

### Build Scripts Warning

If you see this warning:
```
Ignored build scripts: @tailwindcss/oxide, esbuild
```

**Solution 1:** Change Package manager to **npm** instead of pnpm

**Solution 2:** Add this to Build command field (if available):
```bash
pnpm approve-builds && pnpm build
```

### Environment Variables Not Working

1. Create `.env` file manually via File Manager (see Quick Fix above)
2. Make sure the file is in the project root (same level as `dist/` folder)
3. Restart the application after creating the file

### Database Connection Failed

1. Verify database credentials in phpMyAdmin
2. Check if the database user has proper permissions
3. Try using `localhost` instead of `127.0.0.1`
4. Ensure the password doesn't contain special characters that need encoding

### Build Failed

1. Check that all environment variables are set
2. Verify DATABASE_URL is correct and database is accessible
3. Try using npm instead of pnpm

## Database Setup

After deployment, you may need to run migrations:

1. Connect to your MySQL database via phpMyAdmin
2. Import the SQL file from the project

## File Structure After Build

```
project-root/
├── .env              # Create this manually!
├── dist/
│   ├── index.js      # Server entry point
│   └── public/       # Static frontend files
│       ├── index.html
│       └── assets/
└── node_modules/
```

## Debug Endpoints

Use these endpoints to diagnose issues:

- **Check environment variables:** `/api/trpc/debug.envCheck`
- **Check database connection:** `/api/trpc/debug.checkDb`

## Support

If you continue to have issues:
1. Check Hostinger application logs
2. Contact Hostinger support about environment variables
3. Use the manual `.env` file method as a workaround
