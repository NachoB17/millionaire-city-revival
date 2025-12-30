/**
 * Millionaire City Revival - Mock Server MVP
 * 
 * ⚠️  MVP MODE - LOCAL DEVELOPMENT ONLY ⚠️
 * NO SECURITY IMPLEMENTED YET
 * - Passwords stored in plain text (TEMPORARY!)
 * - No JWT authentication
 * - No input validation
 * - For local testing only
 * 
 * This will be secured in Phase 2 - Week 2
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Create db directory if it doesn't exist
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const DB_PATH = path.join(dbDir, 'millionaire_city.db');

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== DATABASE ====================

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to SQLite database');
    initDatabase();
  }
});

/**
 * Initialize database schema
 */
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

    // Cities table
    db.run(`
      CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT DEFAULT 'My City',
        level INTEGER DEFAULT 1,
        cash INTEGER DEFAULT 10000,
        xp INTEGER DEFAULT 0,
        population INTEGER DEFAULT 0,
        max_population INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Buildings table
    db.run(`
      CREATE TABLE IF NOT EXISTS buildings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_id INTEGER NOT NULL,
        building_type TEXT NOT NULL,
        position_x INTEGER NOT NULL,
        position_y INTEGER NOT NULL,
        level INTEGER DEFAULT 1,
        income_rate INTEGER DEFAULT 100,
        collection_time INTEGER DEFAULT 3600,
        last_collected TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        constructed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      )
    `);

    // Building types catalog
    db.run(`
      CREATE TABLE IF NOT EXISTS building_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        base_cost INTEGER NOT NULL,
        base_income INTEGER NOT NULL,
        build_time INTEGER DEFAULT 0,
        width INTEGER DEFAULT 1,
        height INTEGER DEFAULT 1,
        unlock_level INTEGER DEFAULT 1,
        max_level INTEGER DEFAULT 5
      )
    `);

    console.log('✅ Database schema initialized');
    seedBuildingTypes();
  });
}

/**
 * Seed building types catalog
 */
function seedBuildingTypes() {
  const buildingTypes = [
    {
      id: 'small_house',
      name: 'Small House',
      category: 'residential',
      base_cost: 500,
      base_income: 10,
      build_time: 10,
      width: 1,
      height: 1,
      unlock_level: 1,
      max_level: 3
    },
    {
      id: 'apartment',
      name: 'Apartment Building',
      category: 'residential',
      base_cost: 2000,
      base_income: 50,
      build_time: 30,
      width: 2,
      height: 2,
      unlock_level: 3,
      max_level: 5
    },
    {
      id: 'shop',
      name: 'Shop',
      category: 'commercial',
      base_cost: 1000,
      base_income: 25,
      build_time: 20,
      width: 1,
      height: 1,
      unlock_level: 2,
      max_level: 4
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      category: 'commercial',
      base_cost: 3000,
      base_income: 75,
      build_time: 45,
      width: 2,
      height: 1,
      unlock_level: 5,
      max_level: 5
    },
    {
      id: 'park',
      name: 'Park',
      category: 'decoration',
      base_cost: 200,
      base_income: 0,
      build_time: 5,
      width: 2,
      height: 2,
      unlock_level: 1,
      max_level: 1
    }
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO building_types 
    (id, name, category, base_cost, base_income, build_time, width, height, unlock_level, max_level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  buildingTypes.forEach(bt => {
    stmt.run(bt.id, bt.name, bt.category, bt.base_cost, bt.base_income, 
             bt.build_time, bt.width, bt.height, bt.unlock_level, bt.max_level);
  });

  stmt.finalize();
}

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Millionaire City Server is running',
    version: '0.1.0-mvp',
    mode: 'LOCAL DEV - NO SECURITY',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Server info
app.get('/info', (req, res) => {
  res.json({
    name: 'Millionaire City Revival Server',
    description: 'Mock server replacing Digital Chocolate servers',
    version: '0.1.0-mvp',
    mode: 'MVP - LOCAL DEVELOPMENT ONLY',
    security: 'DISABLED - WILL BE ADDED IN WEEK 2',
    endpoints: {
      auth: ['/auth/register', '/auth/login'],
      game: ['/game/city/:id'],
      buildings: ['/buildings/types', '/buildings/place', '/buildings/collect']
    }
  });
});

// ==================== AUTH (NO SECURITY!) ====================

app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // ⚠️  PLAIN TEXT PASSWORD - TEMPORARY!
  const passwordHash = password;

  db.run(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, passwordHash],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Registration failed' });
      }

      const userId = this.lastID;

      // Create default city
      db.run(
        'INSERT INTO cities (user_id, name) VALUES (?, ?)',
        [userId, `${username}'s City`],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'City creation failed' });
          }

          res.status(201).json({
            userId,
            cityId: this.lastID,
            username,
            message: 'User registered successfully'
          });
        }
      );
    }
  );
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT u.id, u.username, c.id as city_id 
     FROM users u 
     LEFT JOIN cities c ON u.id = c.user_id 
     WHERE u.username = ? AND u.password_hash = ?`,
    [username, password],
    (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        userId: row.id,
        username: row.username,
        cityId: row.city_id,
        message: 'Login successful'
      });
    }
  );
});

// ==================== GAME ====================

app.get('/game/city/:cityId', (req, res) => {
  const { cityId } = req.params;

  db.get('SELECT * FROM cities WHERE id = ?', [cityId], (err, city) => {
    if (err || !city) {
      return res.status(404).json({ error: 'City not found' });
    }

    db.all('SELECT * FROM buildings WHERE city_id = ?', [cityId], (err, buildings) => {
      res.json({
        city: {
          id: city.id,
          name: city.name,
          level: city.level,
          cash: city.cash,
          xp: city.xp,
          population: city.population,
          maxPopulation: city.max_population
        },
        buildings: buildings || []
      });
    });
  });
});

app.get('/buildings/types', (req, res) => {
  db.all('SELECT * FROM building_types', (err, types) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch building types' });
    }
    res.json(types);
  });
});

app.post('/buildings/place', (req, res) => {
  const { cityId, buildingType, positionX, positionY } = req.body;

  if (!cityId || !buildingType || positionX === undefined || positionY === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get building type info
  db.get('SELECT * FROM building_types WHERE id = ?', [buildingType], (err, type) => {
    if (err || !type) {
      return res.status(404).json({ error: 'Building type not found' });
    }

    // Get city
    db.get('SELECT * FROM cities WHERE id = ?', [cityId], (err, city) => {
      if (err || !city) {
        return res.status(404).json({ error: 'City not found' });
      }

      // Check if enough cash (MVP - no validation for now)
      if (city.cash < type.base_cost) {
        return res.status(402).json({ error: 'Insufficient cash' });
      }

      // Place building
      db.run(
        `INSERT INTO buildings (city_id, building_type, position_x, position_y, income_rate, collection_time)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cityId, buildingType, positionX, positionY, type.base_income, 3600],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to place building' });
          }

          // Update city cash
          db.run('UPDATE cities SET cash = cash - ? WHERE id = ?', [type.base_cost, cityId]);

          res.status(201).json({
            buildingId: this.lastID,
            message: 'Building placed successfully',
            newCash: city.cash - type.base_cost
          });
        }
      );
    });
  });
});

app.post('/buildings/:id/collect', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM buildings WHERE id = ?', [id], (err, building) => {
    if (err || !building) {
      return res.status(404).json({ error: 'Building not found' });
    }

    // Calculate income (simplified - always allow collection)
    const income = building.income_rate;

    // Update city cash
    db.run('UPDATE cities SET cash = cash + ? WHERE id = ?', [income, building.city_id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to collect income' });
      }

      // Update last collected
      db.run('UPDATE buildings SET last_collected = ? WHERE id = ?', 
             [new Date().toISOString(), id]);

      // Get new balance
      db.get('SELECT cash FROM cities WHERE id = ?', [building.city_id], (err, city) => {
        res.json({
          income,
          newBalance: city.cash,
          message: 'Income collected'
        });
      });
    });
  });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ==================== START SERVER ====================

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🎮 ==========================================');
  console.log('   Millionaire City Revival Server MVP');
  console.log('   ==========================================');
  console.log(`   🚀 Server: http://localhost:${PORT}`);
  console.log(`   📊 Health: http://localhost:${PORT}/health`);
  console.log('   ==========================================');
  console.log('   ⚠️  MVP MODE - NO SECURITY');
  console.log('   📝 Phase 2 - Week 1 (Foundation)');
  console.log('   ✅ Database initialized');
  console.log('   🔄 Ready for local testing');
  console.log('   ==========================================');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    db.close((err) => {
      if (err) console.error('Error closing database:', err);
      else console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
