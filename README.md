# 🎮 Millionaire City Revival

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Phase](https://img.shields.io/badge/Phase-2%20%7C%20Server%20Development-blue)](https://github.com/NachoB17/millionaire-city-revival)
[![Progress](https://img.shields.io/badge/Progress-15%25-orange)](https://github.com/NachoB17/millionaire-city-revival/projects)

> 🕹️ **Bringing back Millionaire City to life!**  
> A complete reverse engineering and PC port project of the classic Digital Chocolate mobile game.

---

## 📖 About

**Millionaire City** was a popular city-building simulation game developed by Digital Chocolate for Facebook and mobile platforms. After the company's closure in 2014, the game became unplayable as the servers were shut down.

This project aims to:
- 🔓 **Reverse engineer** the original Android APK
- 🖥️ **Create a PC version** using modern technologies
- 🌐 **Build a local server** to replace the defunct online services
- 🎨 **Preserve** the original assets and gameplay
- 🚀 **Make it playable offline** for nostalgic fans

---

## 🎯 Project Status

### ✅ Phase 1: Analysis & Decompilation (COMPLETED)
- [x] APK successfully decompiled
- [x] 614 PNG assets extracted
- [x] Architecture documented
- [x] Game mechanics identified

### 🔄 Phase 2: Server Development (IN PROGRESS - MVP MODE 🚀)
- [x] Repository created
- [x] Project structure setup
- [x] Minimal working server (NO SECURITY - LOCAL ONLY)
- [ ] Full game endpoints
- [ ] Building placement system
- [ ] Economy system

### ⏳ Phase 3: APK Patching (UPCOMING)
- [ ] Modify server URLs
- [ ] Remove payment systems
- [ ] Recompile and sign APK

### ⏳ Phase 4: PC Port (UPCOMING)
- [ ] Godot/Unity setup
- [ ] Asset import
- [ ] Gameplay implementation

---

## 🚀 Quick Start (MVP - 2 Minutes!)

```bash
# Clone the repository
git clone https://github.com/NachoB17/millionaire-city-revival.git
cd millionaire-city-revival/server

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

### Test it works

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Millionaire City Server is running"
}
```

---

## 📁 Repository Structure

```
millionaire-city-revival/
├── README.md
├── LICENSE
├── server/                 # Node.js mock server
│   ├── server.js          # Main server (MVP - NO AUTH)
│   ├── package.json
│   └── db/                # SQLite database (auto-created)
└── docs/                  # Documentation
    ├── API.md
    ├── DATABASE_SCHEMA.md
    └── ROADMAP.md
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** SQLite3
- **Mode:** Local development (NO SECURITY YET)

---

## ⚖️ Legal & Ethics

This project is for:
- ✅ Educational purposes
- ✅ Personal use
- ✅ Game preservation

**Important:**
- ❌ No commercial use
- ❌ No public APK distribution
- ⚠️ For local use only

Digital Chocolate closed in 2014, servers are permanently offline. This project aims to preserve the game.

---

## 📬 Contact

**Author:** MF  
**GitHub:** [@NachoB17](https://github.com/NachoB17)

---

<div align="center">
  <p><strong>Made with ❤️ and nostalgia</strong></p>
  <p><em>"Building virtual empires, one commit at a time"</em></p>
</div>
