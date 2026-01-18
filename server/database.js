import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'cms.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema and default data
 */
export const initializeDatabase = () => {
  try {
    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        link TEXT DEFAULT '#',
        category TEXT DEFAULT 'Notices',
        image_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS programmes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        url TEXT DEFAULT '#',
        category TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS about (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS org_chart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT,
        category TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS footer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        about TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Initialize default admin if not exists
    const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin').get();
    if (adminExists.count === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', hashedPassword);
      console.log('Default admin created: admin / admin123');
    }

    // Initialize default about description if not exists
    const aboutExists = db.prepare('SELECT COUNT(*) as count FROM about').get();
    if (aboutExists.count === 0) {
      const defaultDescription = `Center for Graduate Studies at the Faculty of Computer and Mathematical Sciences is responsible for offering postgraduate programs, including Coursework Master's, Research Master's, and Doctor of Philosophy programs in various fields under Computer Sciences and Mathematical Sciences.

These programs are designed holistically, focusing on industry-oriented education and ensuring our students possess the skills and knowledge to thrive in their chosen fields. Our coursework and research programs harness cutting-edge technology to expand the breadth of learning and offer students an outstanding chance to explore new frontiers related to artificial intelligence, analytics, cybersecurity, informatics, and others.

Advanced facilities are provided to support the teaching and learning activities and implement the integrated curriculum. Among the facilities provided are Science Data Laboratories, a Security Operation Centre, a Digital Forensic Lab, an IoT Lab, an Intelligent Information System Lab, Centre for UiTM – Maple, an Actuary Resource Centre and so on.

Our programs will provide students with the best tools, skills, and knowledge to excel on a professional level and apply what they have learned in career and life.`;
      db.prepare('INSERT INTO about (description) VALUES (?)').run(defaultDescription);
    }

    // Initialize default footer if not exists
    const footerExists = db.prepare('SELECT COUNT(*) as count FROM footer').get();
    if (footerExists.count === 0) {
      db.prepare(`
        INSERT INTO footer (about, address, phone, email) 
        VALUES (?, ?, ?, ?)
      `).run(
        'Empowering postgraduate students to achieve academic excellence through innovative research, professional development, and collaboration.',
        'Faculty of Computer and Mathematical Sciences (FSKM),\nUniversiti Teknologi MARA (UiTM)',
        '+60 3-5544 2000',
        'fskm.postgrad@uitm.edu.my'
      );
    }

    // Initialize default programmes if not exists
    const programmesExists = db.prepare('SELECT COUNT(*) as count FROM programmes').get();
    if (programmesExists.count === 0) {
      const defaultProgrammes = [
        // Computing programmes
        ['CS700', 'Postgraduate Certificate in Data Science', '#', 'Computing'],
        ['CS707', 'Master of Computer Science', '#', 'Computing'],
        ['CS708', 'Master of Science in Computer Networking', '#', 'Computing'],
        ['CS709', 'Master of Science in Cybersecurity and Digital Forensics', '#', 'Computing'],
        ['CS750', 'Master of Science (Computer Science)', '#', 'Computing'],
        ['CS751', 'Master of Science (Information Technology)', '#', 'Computing'],
        ['CS770', 'Master of Science in Information Technology', '#', 'Computing'],
        ['CS779', 'Master of Data Science', '#', 'Computing'],
        ['CS950', 'Doctor of Philosophy (Computer Science)', '#', 'Computing'],
        ['CS951', 'Doctor of Philosophy (Information Technology)', '#', 'Computing'],
        // Mathematics programmes
        ['CS702', 'Master of Science in Applied Statistics', '#', 'Mathematics'],
        ['CS752', 'Master of Science (Mathematics)', '#', 'Mathematics'],
        ['CS753', 'Master of Science (Statistics)', '#', 'Mathematics'],
        ['CS755', 'Master of Science (Actuarial Science)', '#', 'Mathematics'],
        ['CS773', 'Master of Science in Applied Mathematics', '#', 'Mathematics'],
        ['CS952', 'Doctor of Philosophy (Mathematics)', '#', 'Mathematics'],
        ['CS953', 'Doctor of Philosophy (Statistics)', '#', 'Mathematics'],
        ['CS954', 'Doctor of Philosophy (Decision Science)', '#', 'Mathematics'],
        ['CS955', 'Doctor of Philosophy (Actuarial Science)', '#', 'Mathematics']
      ];

      const insertProgramme = db.prepare('INSERT INTO programmes (code, name, url, category) VALUES (?, ?, ?, ?)');
      for (const [code, name, url, category] of defaultProgrammes) {
        insertProgramme.run(code, name, url, category);
      }
      console.log('Default programmes created');
    }

    // Initialize default announcements if not exists
    const announcementsExists = db.prepare('SELECT COUNT(*) as count FROM announcements').get();
    if (announcementsExists.count === 0) {
      const defaultAnnouncements = [
        [
          'Returned Student Registration',
          'Important information for returned students regarding registration procedures and deadlines.',
          '#',
          'Notices',
          '/announcement/returned_student.jpg'
        ],
        [
          'Briefing Session for New Postgraduate Students',
          'Join us for an important briefing session for all new postgraduate students. Learn about academic requirements, facilities, and support services.',
          '#',
          'Academic',
          '/announcement/brief_session.jpg'
        ]
      ];

      const insertAnnouncement = db.prepare('INSERT INTO announcements (title, description, link, category, image_url) VALUES (?, ?, ?, ?, ?)');
      for (const [title, description, link, category, imageUrl] of defaultAnnouncements) {
        insertAnnouncement.run(title, description, link, category, imageUrl);
      }
      console.log('Default announcements created');
    }

    // Initialize default org chart members if not exists
    const orgChartExists = db.prepare('SELECT COUNT(*) as count FROM org_chart').get();
    const defaultMembers = [
      ['Assoc. Prof Ts. Dr. Suhaila Abd Halim', 'Head of Center (Postgraduates)', 'suhaila889@uitm.edu.my', 'leadership'],
      ['Assoc. Prof. Dr. Shafaf Ibrahim', 'Postgraduate Coordinator (Research)', 'shafaf2429@uitm.edu.my', 'research'],
      ['Dr. Emma Nuraihan Mior Ibrahim', 'Coordinator (Research Programme)\nPhD of Computing Science', 'emmanuraihan@uitm.edu.my', 'research'],
      ['Ts. Dr. Ahmad Faiz Ghazali', 'Coordinator (Research Programme)\nMaster of Computing Sciences', 'faizghazali@uitm.edu.my', 'research'],
      ['Dr. Hazizah Mohd Ijam', 'Coordinator (Research Programme)\nPhD of Mathematical Sciences', 'hazizahijam@uitm.edu.my', 'research'],
      ['Dr. Nadhirah Abdul Halim', 'Coordinator (Research Programme)\nMaster of Mathematical Sciences', 'nadhirahhalim@uitm.edu.my', 'research'],
      ['Assoc. Prof. Dr. Norizan Mat Diah', 'Coordinator (Coursework Programme)\nMaster of Computer Science', null, 'coursework'],
      ['Dr. Siti Arpah Ahmad', 'Coordinator (Coursework Programme)\nMaster of Computer Science', 'arpah340@uitm.edu.my', 'coursework'],
      ['Dr. Norkhushaini Awang', 'Coordinator (Coursework Programme)\nMaster of Computer Science', 'nor_awang@uitm.edu.my', 'coursework'],
      ['Dr. Azlin Ahmad', 'Coordinator (Coursework Programme)\nMaster of Computer Science', 'azlin121@uitm.edu.my', 'coursework'],
      ['Dr. Nurain Ibrahim', 'Coordinator (Coursework Programme)\nMaster of Mathematical Sciences', 'nurainibrahim@uitm.edu.my', 'coursework']
    ];

    if (orgChartExists.count === 0) {
      // Insert all default members
      const insertMember = db.prepare('INSERT INTO org_chart (name, role, email, category) VALUES (?, ?, ?, ?)');
      for (const [name, role, email, category] of defaultMembers) {
        insertMember.run(name, role, email, category);
      }
      console.log('Default org chart members created');
    } else {
      // If table exists, add any missing members (by name)
      const checkMember = db.prepare('SELECT COUNT(*) as count FROM org_chart WHERE name = ?');
      const insertMember = db.prepare('INSERT INTO org_chart (name, role, email, category) VALUES (?, ?, ?, ?)');
      let addedCount = 0;
      
      for (const [name, role, email, category] of defaultMembers) {
        const exists = checkMember.get(name);
        if (exists.count === 0) {
          insertMember.run(name, role, email, category);
          addedCount++;
        }
      }
      
      if (addedCount > 0) {
        console.log(`Added ${addedCount} missing org chart members`);
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * Get admin by username
 */
export const getAdminByUsername = (username) => {
  return db.prepare('SELECT * FROM admin WHERE username = ?').get(username);
};

/**
 * Update admin password
 */
export const updateAdminPassword = (username, hashedPassword) => {
  const result = db.prepare('UPDATE admin SET password = ? WHERE username = ?').run(hashedPassword, username);
  return result.changes > 0;
};

// ==================== ANNOUNCEMENTS ====================
export const getAllAnnouncements = () => {
  return db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC').all();
};

export const getAnnouncementById = (id) => {
  return db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
};

export const createAnnouncement = (data) => {
  const { title, description, link, category, imageUrl } = data;
  const result = db.prepare(`
    INSERT INTO announcements (title, description, link, category, image_url) 
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description || '', link || '#', category || 'Notices', imageUrl || '/announcement/default.jpg');
  
  return getAnnouncementById(result.lastInsertRowid);
};

export const deleteAnnouncement = (id) => {
  return db.prepare('UPDATE announcements SET is_active = 0 WHERE id = ?').run(id);
};

// ==================== PROGRAMMES ====================
export const getAllProgrammes = () => {
  return db.prepare('SELECT * FROM programmes WHERE is_active = 1 ORDER BY category, code').all();
};

export const getProgrammeById = (id) => {
  return db.prepare('SELECT * FROM programmes WHERE id = ?').get(id);
};

export const createProgramme = (data) => {
  const { code, name, url, category } = data;
  const result = db.prepare(`
    INSERT INTO programmes (code, name, url, category) 
    VALUES (?, ?, ?, ?)
  `).run(code, name, url || '#', category || 'Computing');
  
  return getProgrammeById(result.lastInsertRowid);
};

export const updateProgramme = (id, data) => {
  const { code, name, url, category } = data;
  db.prepare(`
    UPDATE programmes 
    SET code = ?, name = ?, url = ?, category = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(code, name, url, category, id);
  
  return getProgrammeById(id);
};

export const deleteProgramme = (id) => {
  return db.prepare('UPDATE programmes SET is_active = 0 WHERE id = ?').run(id);
};

// ==================== ABOUT US ====================
export const getAboutDescription = () => {
  const result = db.prepare('SELECT description FROM about ORDER BY id DESC LIMIT 1').get();
  return result ? { description: result.description } : { description: '' };
};

export const updateAboutDescription = (description) => {
  db.prepare('UPDATE about SET description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT MAX(id) FROM about)').run(description);
  return getAboutDescription();
};

// ==================== ORGANISATION CHART ====================
export const getAllOrgChartMembers = () => {
  return db.prepare('SELECT * FROM org_chart WHERE is_active = 1 ORDER BY category, name').all();
};

export const getOrgChartMemberById = (id) => {
  return db.prepare('SELECT * FROM org_chart WHERE id = ?').get(id);
};

export const createOrgChartMember = (data) => {
  const { name, role, email, category } = data;
  const result = db.prepare(`
    INSERT INTO org_chart (name, role, email, category) 
    VALUES (?, ?, ?, ?)
  `).run(name, role, email || null, category || 'research');
  
  return getOrgChartMemberById(result.lastInsertRowid);
};

export const updateOrgChartMember = (id, data) => {
  const { name, role, email, category } = data;
  db.prepare(`
    UPDATE org_chart 
    SET name = ?, role = ?, email = ?, category = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(name, role, email || null, category, id);
  
  return getOrgChartMemberById(id);
};

export const deleteOrgChartMember = (id) => {
  return db.prepare('UPDATE org_chart SET is_active = 0 WHERE id = ?').run(id);
};

// ==================== FOOTER ====================
export const getFooter = () => {
  const result = db.prepare('SELECT * FROM footer ORDER BY id DESC LIMIT 1').get();
  if (!result) {
    return {
      about: '',
      contact: {
        address: '',
        phone: '',
        email: ''
      }
    };
  }
  
  return {
    about: result.about,
    contact: {
      address: result.address,
      phone: result.phone,
      email: result.email
    }
  };
};

export const updateFooter = (data) => {
  const { about, contact } = data;
  
  if (about !== undefined) {
    db.prepare('UPDATE footer SET about = ?, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT MAX(id) FROM footer)').run(about);
  }
  
  if (contact) {
    const updates = [];
    const values = [];
    
    if (contact.address !== undefined) {
      updates.push('address = ?');
      values.push(contact.address);
    }
    if (contact.phone !== undefined) {
      updates.push('phone = ?');
      values.push(contact.phone);
    }
    if (contact.email !== undefined) {
      updates.push('email = ?');
      values.push(contact.email);
    }
    
    if (updates.length > 0) {
      db.prepare(`UPDATE footer SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = (SELECT MAX(id) FROM footer)`).run(...values);
    }
  }
  
  return getFooter();
};

// Close database connection gracefully
export const closeDatabase = () => {
  db.close();
};

export default db;





