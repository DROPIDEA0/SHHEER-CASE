# Hostinger Node.js Deployment Guide - Updated

## ⚠️ Important: Entry File Configuration

**Entry file must be: `server.js`** (NOT `dist/index.js`)

## Quick Setup Steps

### Step 1: Hostinger Settings

| Setting | Value |
|---------|-------|
| **Framework preset** | Express |
| **Branch** | main |
| **Node version** | 22.x |
| **Root directory** | ./ |
| **Entry file** | **server.js** |
| **Package manager** | npm (recommended) |

### Step 2: Environment Variables (Required)

Set these in Hostinger Dashboard → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `mysql://u713123409_shheer_case:YOUR_PASSWORD@127.0.0.1:3306/u713123409_shheer_case` |
| `DB_HOST` | `127.0.0.1` |
| `DB_PORT` | `3306` |
| `DB_USER` | `u713123409_shheer_case` |
| `DB_PASSWORD` | `YOUR_PASSWORD` |
| `DB_NAME` | `u713123409_shheer_case` |
| `JWT_SECRET` | `3f9c8e7a1d4b6a0e9c2f5b8d7a6c4e1f0b9a8d5c7e2f4a6b1c9e8d0f5a2` |
| `NODE_ENV` | `production` |

**Replace `YOUR_PASSWORD` with your actual database password: `Downy1441680798402930`**

### Step 3: Create .env File (Backup Method)

If environment variables don't work, create `.env` file manually via Hostinger File Manager:

1. Go to File Manager
2. Navigate to project root (where `dist/` folder is)
3. Create new file named `.env`
4. Add content:

```env
DATABASE_URL=mysql://u713123409_shheer_case:Downy1441680798402930@127.0.0.1:3306/u713123409_shheer_case
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=u713123409_shheer_case
DB_PASSWORD=Downy1441680798402930
DB_NAME=u713123409_shheer_case
JWT_SECRET=3f9c8e7a1d4b6a0e9c2f5b8d7a6c4e1f0b9a8d5c7e2f4a6b1c9e8d0f5a2
NODE_ENV=production
```

### Step 4: Restart Application

After setting environment variables or creating .env file, restart the application from Hostinger dashboard.

---

## Troubleshooting

### Error 503 Service Unavailable

**Causes:**
1. Server crashed during startup
2. Environment variables not loaded
3. Database connection failed

**Solutions:**
1. Check Entry file is set to `server.js`
2. Verify environment variables are set correctly
3. Create `.env` file manually (Step 3 above)
4. Check application logs in Hostinger

### Database Connection Issues

**Test connection:**
Visit: `https://shheercase.com/api/debug`

This will show:
- Environment variables status
- Database connection status
- Error messages if any

### Build Warnings

If you see "Ignored build scripts" warning:
- Change Package manager to **npm** instead of pnpm
- Or ignore the warning (it usually doesn't affect functionality)

---

## Debug Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/debug` | Shows environment status and errors |
| `/api/health` | Health check (if in fallback mode) |
| `/api/trpc/debug.checkDb` | Detailed database status |
| `/api/trpc/debug.envCheck` | Environment variables check |

---

## File Structure

```
project-root/
├── server.js          # Entry point (Hostinger starts here)
├── .env               # Environment variables (create manually if needed)
├── dist/
│   ├── index.js       # Built server code
│   └── public/        # Built frontend files
├── node_modules/
└── package.json
```

---

## Support

If issues persist:
1. Check Hostinger application logs
2. Visit `/api/debug` to see error details
3. Contact Hostinger support about Node.js environment variables
