# CMS Server

This is the backend server for the Content Management System (CMS).

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change the default password in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token (protected)

### Announcements
- `GET /api/announcements` - Get all active announcements
- `POST /api/announcements` - Create announcement (protected)
- `DELETE /api/announcements/:id` - Delete announcement (protected)

### Programmes
- `GET /api/programmes` - Get all active programmes
- `POST /api/programmes` - Create programme (protected)
- `PUT /api/programmes/:id` - Update programme (protected)
- `DELETE /api/programmes/:id` - Delete programme (protected)

### About Us
- `GET /api/about/description` - Get about description
- `PUT /api/about/description` - Update about description (protected)
- `GET /api/about/org-chart` - Get organization chart
- `POST /api/about/org-chart` - Add member (protected)
- `PUT /api/about/org-chart/:id` - Update member (protected)
- `DELETE /api/about/org-chart/:id` - Delete member (protected)

### Footer
- `GET /api/footer` - Get footer content
- `PUT /api/footer` - Update footer content (protected)

## Database

The server uses **SQLite** (`cms.db`) to store data. The database file and schema are automatically created on first run with default data.

## File Uploads

Uploaded images are stored in the `server/uploads/` directory. Make sure this directory exists and has write permissions.

## Environment Variables

- `VITE_CMS_API` - API base URL (set in frontend `.env` file)
- `JWT_SECRET` - Secret key for JWT tokens (currently hardcoded in `server.js` - change in production!)

## Production Considerations

1. Change the JWT_SECRET to a secure random string (use environment variable)
2. Change the default admin password
3. Set up proper database backups for SQLite
4. Add rate limiting and security middleware
5. Set up proper CORS configuration for your domain
6. Use environment variables for configuration (PORT, JWT_SECRET, etc.)
7. Consider database migrations for schema updates

