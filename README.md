# NU Digital Dashboard — Backend Standalone

Dashboard Transformasi Digital NU untuk Muktamar MIP IV 2026.

---

## Cara Deploy di Railway

1. **Push ke GitHub** (repo baru atau existing)
2. **Buka** [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. **Set Environment Variable:**
   ```
   CLAUDE_API_KEY = sk-ant-xxxxxxxxxxxxxxxxx
   ```
4. Railway otomatis detect `package.json` dan jalankan `npm start`
5. Akses via URL Railway yang diberikan

---

## Cara Jalankan Lokal

```bash
# Install dependencies
npm install

# Set API Key (Windows)
set CLAUDE_API_KEY=sk-ant-xxxxxxxxxx

# Set API Key (Mac/Linux)
export CLAUDE_API_KEY=sk-ant-xxxxxxxxxx

# Jalankan server
npm start

# Buka browser
http://localhost:3000
```

---

## Struktur File

```
dashboard-backend/
├── server.js          ← Backend Express (proxy Claude API)
├── package.json
├── README.md
└── public/
    └── index.html     ← Frontend dashboard
```

---

## Endpoint API

| Method | Path | Keterangan |
|--------|------|-----------|
| GET | `/health` | Cek status server & API Key |
| POST | `/api/chat` | Kirim pesan ke Claude AI |

---

## Keamanan

- API Key **hanya ada di server** (environment variable Railway)
- Frontend tidak pernah melihat API Key
- Sama persis dengan arsitektur APAKLI & kopipakdhe.store
