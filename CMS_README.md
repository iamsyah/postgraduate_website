# CMS (Content Management System) Documentation

This website now includes a complete Content Management System (CMS) for managing website content.

## Accessing the CMS

1. Navigate to `/admin/login` in your browser
2. Login with the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

⚠️ **Important:** Change the default password in production!

## CMS Features

### 1. Announcements Management
- **Location:** `/admin/announcements`
- **Features:**
  - Add new announcements with title, description, image, category, and link
  - Delete announcements
  - Upload images for announcements
  - Categorize announcements (Notices, Academic, Events, Workshops)

### 2. Programmes Management
- **Location:** `/admin/programmes`
- **Features:**
  - Add new programmes with code, name, URL, and category (Computing/Mathematics)
  - Edit existing programmes
  - Delete programmes
  - View programmes organized by category

### 3. About Us Management
- **Location:** `/admin/about`
- **Features:**
  - Edit the "About Us" description text
  - Supports multi-paragraph text with line breaks

### 4. Organisation Chart Management
- **Location:** `/admin/org-chart`
- **Features:**
  - Add new members with name, role, email, and category
  - Edit existing members
  - Delete members
  - Organize members by category:
    - Leadership
    - Research Programme Coordinators
    - Coursework Programme Coordinators

### 5. Footer Management
- **Location:** `/admin/footer`
- **Features:**
  - Edit footer "About" text
  - Update contact information (address, phone, email)
  - Supports multi-line addresses

## Setting Up the CMS Backend

### Prerequisites
- Node.js installed on your system

### Installation Steps

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the server:**
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### Frontend Configuration

The frontend is already configured to connect to the CMS API. The API URL is set via environment variable:

- Default: `http://localhost:3001/api`
- Set `VITE_CMS_API` in your `.env` file to change the API URL

Example `.env` file:
```
VITE_CMS_API=http://localhost:3001/api
```

## Running the Complete Application

### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
npm run dev
```

Then visit:
- **Website:** `http://localhost:5173` (or your Vite port)
- **CMS Login:** `http://localhost:5173/admin/login`

## File Structure

```
postgraduate-website/
├── server/                  # Backend API server
│   ├── server.js           # Express server with API routes
│   ├── database.js         # SQLite database operations
│   ├── package.json        # Server dependencies
│   ├── cms.db              # SQLite database (auto-created)
│   └── uploads/            # Uploaded images directory
├── src/
│   ├── pages/
│   │   ├── AdminLogin.jsx           # Admin login page
│   │   ├── AdminDashboard.jsx       # Admin dashboard
│   │   └── admin/                   # Admin management pages
│   │       ├── AdminAnnouncements.jsx
│   │       ├── AdminProgrammes.jsx
│   │       ├── AdminAbout.jsx
│   │       ├── AdminOrgChart.jsx
│   │       └── AdminFooter.jsx
│   └── components/
│       └── AdminProtectedRoute.jsx  # Route protection component
└── ...
```

## Security Notes

1. **Change Default Password:** Update the admin password in `server/server.js` before deploying to production
2. **JWT Secret:** Change the `JWT_SECRET` in `server/server.js` or use environment variable to a secure random string
3. **Database:** SQLite is used for simplicity. For production with high traffic, consider PostgreSQL or MySQL
4. **CORS:** Configure CORS properly for your domain in production
5. **Rate Limiting:** Add rate limiting to prevent abuse

## Troubleshooting

### Server won't start
- Make sure port 3001 is not already in use
- Check that all dependencies are installed (`npm install` in server directory)

### Can't login to CMS
- Verify the server is running on port 3001
- Check browser console for errors
- Verify default credentials: `admin` / `admin123`

### Images not uploading
- Ensure `server/uploads/` directory exists
- Check file permissions on the uploads directory

### Database errors
- Ensure SQLite database file (`cms.db`) has write permissions
- Check that `better-sqlite3` package is properly installed
- Try deleting `cms.db` and restarting server to recreate database

### Frontend can't connect to API
- Verify server is running
- Check `VITE_CMS_API` environment variable matches server URL
- Check browser console for CORS errors

## Support

For issues or questions, please check:
1. Server console logs
2. Browser console logs
3. Network tab in browser DevTools

