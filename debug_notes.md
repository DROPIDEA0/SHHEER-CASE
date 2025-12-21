# Debug Notes - Admin Panel Issue

## Problem Identified
The admin panel shows "0 events", "0 items", "0 videos" because:

1. **Authentication Required**: The admin API endpoints require authentication (adminProcedure)
2. **Error Message**: "Please login (10001)" - UNAUTHORIZED error
3. **Database Connection**: Working correctly (status: "connected")
4. **Public API**: Works fine (shows 17 timeline events on public site)

## Root Cause
The admin routes use `adminProcedure` which requires:
1. User to be logged in (session cookie)
2. User role to be 'admin'

Since there's no session cookie, all admin API calls fail with UNAUTHORIZED.

## Solution Options
1. **Option A**: Make admin routes work without authentication for development
2. **Option B**: Create a bypass for local development
3. **Option C**: Add a development mode that auto-authenticates

## Files to Modify
- `/server/_core/trpc.ts` - Contains the protectedProcedure that checks authentication
- `/server/routers.ts` - Contains adminProcedure that checks admin role
