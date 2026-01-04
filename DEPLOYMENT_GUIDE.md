# Quick Deployment Guide for Frontend API Configuration

## Issue Fixed
The frontend was hardcoding API requests to `http://localhost:8080` even when deployed to `http://46.224.155.226:3000`, causing login and all API calls to fail.

## Quick Fix Checklist

### ✅ All Fixed - No Action Needed!
The codebase has been updated to automatically detect the correct API endpoint based on:
1. Environment variables (`REACT_APP_API_BASE_URL` or `REACT_APP_API_URL`)
2. Current window location (automatic detection in production)

## How to Deploy

### Option 1: Automatic Detection (Easiest)
Just deploy normally - the frontend will automatically detect the backend URL:
```bash
docker-compose -f docker-compose-test.yml up -d
```
✅ Works with any domain/IP address

### Option 2: Explicit Configuration (Recommended for Production)
Create a `.env` file in your docker directory:
```
REACT_APP_API_BASE_URL=http://46.224.155.226:8080
NODE_ENV=production
```

Then deploy:
```bash
docker-compose -f docker-compose-test.yml up -d
```

### Option 3: Environment Variable
```bash
export REACT_APP_API_BASE_URL=http://46.224.155.226:8080
export NODE_ENV=production
docker-compose -f docker-compose-test.yml up -d
```

## Verification

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Navigate to login**: `http://46.224.155.226:3000/login`
4. **Verify API calls** go to `http://46.224.155.226:8080/api/...` (NOT localhost)

### Example - What You Should See:
```
POST http://46.224.155.226:8080/api/auth/login
GET  http://46.224.155.226:8080/api/cars
GET  http://46.224.155.226:8080/uploads/cars/...
```

### Example - What Was Wrong (Before Fix):
```
POST http://localhost:8080/api/auth/login  ❌ WRONG
GET  http://localhost:8080/api/cars         ❌ WRONG
```

## Key Files to Know About

| File | Purpose |
|------|---------|
| `src/services/api.js` | Main API configuration - handles URL detection |
| `src/services/imageService.js` | Image URL handling - uses dynamic URL detection |
| `.env.example` | Document expected environment variables |
| `docker-compose-test.yml` | Production deployment config |
| `API_CONFIG_FIX.md` | Detailed technical documentation |

## Environment Variables Reference

| Variable | Purpose | Default |
|----------|---------|---------|
| `REACT_APP_API_BASE_URL` | Backend API server URL | Auto-detected from window.location |
| `REACT_APP_API_URL` | Alternative name for API URL | Falls back to `REACT_APP_API_BASE_URL` |
| `NODE_ENV` | Environment mode | `development` |

## Troubleshooting

### Still seeing localhost in console?
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Rebuild the image**: `docker build -f Dockerfile -t karhubty-frontend:latest .`
3. **Redeploy**: `docker-compose -f docker-compose-test.yml up --force-recreate frontend`

### API calls still failing?
1. **Check CORS** on backend - verify `46.224.155.226:3000` is allowed
2. **Verify backend is running**: `curl http://46.224.155.226:8080/api`
3. **Check browser console** for actual error messages
4. **Verify environment variables** in docker-compose

### Port mapping issues?
The frontend automatically maps port `3000 → 8080` for Docker deployments.
- If backend runs on different port, set `REACT_APP_API_BASE_URL=http://46.224.155.226:YOUR_PORT`

## Need More Details?
See [API_CONFIG_FIX.md](./API_CONFIG_FIX.md) for comprehensive technical documentation.
