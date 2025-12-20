# Hostinger Node.js Deployment Guide

## Build Configuration

| Setting | Value |
|---------|-------|
| Framework preset | Express |
| Branch | main |
| Node version | 22.x |
| Root directory | ./ |
| Entry file | dist/index.js |
| Package manager | pnpm |

## Environment Variables

You need to set the following environment variables in Hostinger:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/dbname` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (usually auto-set) | `3000` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32+ character string |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_APP_TITLE` | Website title |
| `VITE_APP_LOGO` | Logo path |

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

### Build Failed

1. Check that all environment variables are set
2. Verify DATABASE_URL is correct and database is accessible
3. Try using npm instead of pnpm

## Database Setup

After deployment, you may need to run migrations:

1. Connect to your MySQL database
2. Run the SQL files from `drizzle/` folder in order

## File Structure After Build

```
dist/
├── index.js      # Server entry point
└── public/       # Static frontend files
    ├── index.html
    └── assets/
```
