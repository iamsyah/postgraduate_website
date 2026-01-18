import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  initializeDatabase,
  getAdminByUsername,
  updateAdminPassword,
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAllProgrammes,
  createProgramme,
  updateProgramme,
  deleteProgramme,
  getAboutDescription,
  updateAboutDescription,
  getAllOrgChartMembers,
  createOrgChartMember,
  updateOrgChartMember,
  deleteOrgChartMember,
  getFooter,
  updateFooter
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'; // Change in production!

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    // Set proper content type for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

console.log('Static file serving configured for:', join(__dirname, 'uploads'));

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Error handling middleware
const handleError = (res, error, message = 'An error occurred') => {
  console.error(message, error);
  res.status(500).json({ error: message });
};

// ==================== AUTHENTICATION ROUTES ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, passwordProvided: !!password });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = getAdminByUsername(username);
    console.log('Admin found:', !!admin);
    
    if (!admin) {
      console.log('Admin not found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Login successful for:', admin.username);
    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    handleError(res, error, 'Login failed');
  }
});

app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

app.put('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const username = req.user.username;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const admin = getAdminByUsername(username);
    
    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = updateAdminPassword(username, hashedPassword);
    
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to change password');
  }
});

// Helper function to transform database row to API response format
const transformAnnouncement = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link,
    category: row.category,
    imageUrl: row.image_url, // Transform snake_case to camelCase
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

// ==================== ANNOUNCEMENTS ROUTES ====================
app.get('/api/announcements', (req, res) => {
  try {
    const announcements = getAllAnnouncements();
    console.log('Raw announcements from database:', announcements);
    // Transform database rows to API response format
    const transformed = announcements.map(transformAnnouncement);
    console.log('Transformed announcements:', transformed);
    res.json(transformed);
  } catch (error) {
    handleError(res, error, 'Failed to fetch announcements');
  }
});

app.post('/api/announcements', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { title, description, link, category } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    console.log('File upload:', req.file ? {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file uploaded');

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/announcement/default.jpg';
    console.log('Image URL to save:', imageUrl);
    
    const announcement = createAnnouncement({
      title,
      description: description || '',
      link: link || '#',
      category: category || 'Notices',
      imageUrl
    });

    console.log('Announcement created:', announcement);
    const transformed = transformAnnouncement(announcement);
    console.log('Transformed announcement:', transformed);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error creating announcement:', error);
    handleError(res, error, 'Failed to create announcement');
  }
});

app.delete('/api/announcements/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }

    const result = deleteAnnouncement(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete announcement');
  }
});

// ==================== PROGRAMMES ROUTES ====================
app.get('/api/programmes', (req, res) => {
  try {
    const programmes = getAllProgrammes();
    res.json(programmes);
  } catch (error) {
    handleError(res, error, 'Failed to fetch programmes');
  }
});

app.post('/api/programmes', authenticateToken, (req, res) => {
  try {
    const { code, name, url, category } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ error: 'Code and name are required' });
    }

    const programme = createProgramme({
      code,
      name,
      url: url || '#',
      category: category || 'Computing'
    });

    res.status(201).json(programme);
  } catch (error) {
    handleError(res, error, 'Failed to create programme');
  }
});

app.put('/api/programmes/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { code, name, url, category } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid programme ID' });
    }

    if (!code || !name) {
      return res.status(400).json({ error: 'Code and name are required' });
    }

    const programme = updateProgramme(id, { code, name, url, category });
    
    if (!programme) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json(programme);
  } catch (error) {
    handleError(res, error, 'Failed to update programme');
  }
});

app.delete('/api/programmes/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid programme ID' });
    }

    const result = deleteProgramme(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Programme not found' });
    }

    res.json({ message: 'Programme deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete programme');
  }
});

// ==================== ABOUT US ROUTES ====================
app.get('/api/about/description', (req, res) => {
  try {
    const about = getAboutDescription();
    res.json(about);
  } catch (error) {
    handleError(res, error, 'Failed to fetch about description');
  }
});

app.put('/api/about/description', authenticateToken, (req, res) => {
  try {
    const { description } = req.body;
    
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const about = updateAboutDescription(description);
    res.json(about);
  } catch (error) {
    handleError(res, error, 'Failed to update about description');
  }
});

// ==================== ORGANISATION CHART ROUTES ====================
app.get('/api/about/org-chart', (req, res) => {
  try {
    const members = getAllOrgChartMembers();
    res.json(members);
  } catch (error) {
    handleError(res, error, 'Failed to fetch organisation chart');
  }
});

app.post('/api/about/org-chart', authenticateToken, (req, res) => {
  try {
    const { name, role, email, category } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const member = createOrgChartMember({
      name,
      role,
      email,
      category: category || 'research'
    });

    res.status(201).json(member);
  } catch (error) {
    handleError(res, error, 'Failed to create organisation member');
  }
});

app.put('/api/about/org-chart/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, email, category } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' });
    }

    const member = updateOrgChartMember(id, { name, role, email, category });
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    handleError(res, error, 'Failed to update organisation member');
  }
});

app.delete('/api/about/org-chart/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const result = deleteOrgChartMember(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete organisation member');
  }
});

// ==================== FOOTER ROUTES ====================
app.get('/api/footer', (req, res) => {
  try {
    const footer = getFooter();
    res.json(footer);
  } catch (error) {
    handleError(res, error, 'Failed to fetch footer');
  }
});

app.put('/api/footer', authenticateToken, (req, res) => {
  try {
    const { about, contact } = req.body;
    
    if (!about && !contact) {
      return res.status(400).json({ error: 'At least one field (about or contact) is required' });
    }

    const footer = updateFooter({ about, contact });
    res.json(footer);
  } catch (error) {
    handleError(res, error, 'Failed to update footer');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and start server
try {
  initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 CMS Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
    console.log(`💾 Database: SQLite (cms.db)`);
    console.log(`🔐 Default admin: admin / admin123`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});
