# Troubleshooting Login Issues

## Common Issues and Solutions

### 1. "Failed to connect to server" Error

**Problem:** The frontend can't reach the backend API.

**Solutions:**
- Make sure the backend server is running:
  ```bash
  cd server
  npm install  # If you haven't already
  npm run dev
  ```
- Check that the server is running on port 3001
- Verify the API URL in your browser console - it should be `http://localhost:3001/api`
- Check if port 3001 is already in use by another application

### 2. "Invalid credentials" Error

**Problem:** Login credentials are incorrect or database not initialized.

**Solutions:**

#### Check if database exists:
- Look for `server/cms.db` file
- If it doesn't exist, restart the server - it will create the database automatically

#### Reset the admin password manually:
If the database exists but login still fails, you can reset it:

1. Stop the server (Ctrl+C)
2. Delete or rename `server/cms.db`:
   ```bash
   cd server
   # Windows:
   del cms.db
   # Or rename it:
   ren cms.db cms.db.backup
   ```
3. Restart the server - it will recreate the database with default credentials
4. Try logging in again with `admin` / `admin123`

#### Check server console logs:
- When you start the server, you should see: "Default admin created: admin / admin123"
- When you try to login, check the console for debug messages

### 3. CORS Errors

**Problem:** Browser blocks requests due to CORS policy.

**Solutions:**
- Make sure both frontend and backend are running
- Check that the `CMS_API` environment variable matches your backend URL
- Verify CORS is enabled in `server/server.js` (it should be with `app.use(cors())`)

### 4. Database Locked Error

**Problem:** SQLite database is locked by another process.

**Solutions:**
- Close all terminals/processes that might be using the database
- Restart the server
- If the problem persists, delete `cms.db` and let it recreate

### 5. Module Not Found Errors

**Problem:** Missing npm packages.

**Solutions:**
```bash
cd server
npm install
```

Make sure `better-sqlite3` is installed:
```bash
npm list better-sqlite3
```

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab:** Look for JavaScript errors
- **Network tab:** 
  - Check if the login request is being sent
  - See the response status and error message
  - Verify the request URL is correct

### 7. Verify Default Credentials

The default credentials are:
- **Username:** `admin` (lowercase, no spaces)
- **Password:** `admin123` (lowercase, no spaces)

Make sure you're typing them exactly, with no extra spaces.

### 8. Test API Endpoint Directly

Test if the backend is working:
1. Open a new browser tab
2. Go to: `http://localhost:3001/api/health`
3. You should see: `{"status":"ok","timestamp":"..."}`

If this doesn't work, the backend server is not running.

### 9. Complete Reset (Last Resort)

If nothing works, do a complete reset:

1. Stop all running servers
2. Delete the database:
   ```bash
   cd server
   del cms.db
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Check console for "Default admin created" message
6. Try logging in with `admin` / `admin123`

## Debugging Steps

1. **Check Server Logs:**
   - Start the server and look for initialization messages
   - Try logging in and check what appears in the server console

2. **Check Frontend Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try logging in and check for errors
   - Check Network tab to see the request/response

3. **Verify Installation:**
   - Backend: `cd server && npm install`
   - Frontend: `npm install` (in root directory)

4. **Check Ports:**
   - Backend should be on port 3001
   - Frontend should be on port 5173 (or check console output)

## Still Having Issues?

If you're still having problems:
1. Check both server and browser console for error messages
2. Verify the exact error message you're seeing
3. Make sure all dependencies are installed
4. Try the complete reset steps above


