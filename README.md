# FixLog – Home Repair & Maintenance Tracker

**React + Bootstrap** (frontend) · **Node.js + Express** (REST API) · **MongoDB** (database) · **JWT** auth

## VS Code me run kaise karein
1. Node.js 18+ install karo (nodejs.org). MongoDB zaruri nahi hai.
2. Project folder VS Code me kholo → `Terminal > New Terminal`
3. Ye 2 commands chalao:
```bash
npm run install-all     # sirf pehli baar (teeno folders ke packages)
npm run dev             # API (5000) + React (5173) saath me
```
4. Browser me kholo: http://localhost:5173
5. **Login:** "Try the demo account" button dabao (demo@fixlog.com / demo123)

MongoDB na ho to app khud temporary DB + demo data bana leti hai (restart par reset hota hai).
Apna MongoDB/Atlas lagana ho to `server/.env` me `MONGO_URI` badlo, phir `npm run seed`.

## Features
- Modern dashboard: stats, 6-month spending chart, repair pipeline, warranty/service reminders
- Repair board: Requested → Assigned → In Progress → Completed (progress track)
- Appliances, Technicians, Costs: search, filters, add/edit/delete modals, validation, toasts
- Dark mode, mobile responsive sidebar
- JWT + bcrypt auth, protected routes, per-user data

## Folder structure
```
fixlog/
├── server/   server.js, db.js, seed.js, models/, middleware/auth.js, routes/
└── client/src/  App.jsx, AuthContext.jsx, api.js, components/, pages/, styles.css
```

## REST API
| Method | Endpoint | Kaam |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | JWT milta hai |
| GET/POST/PUT/DELETE | /api/appliances, /api/technicians, /api/repairs | CRUD (?q=search, filters) |
| PATCH | /api/repairs/:id/status | Workflow aage badhao |
| GET/POST/PUT/DELETE | /api/maintenance | Cost history |
| GET | /api/dashboard | Stats + charts + reminders |

Header: `Authorization: Bearer <token>`

## Git
```bash
git init && git add . && git commit -m "FixLog v2"
git branch -M main && git remote add origin <repo-url> && git push -u origin main
```

## Deploy
- DB: MongoDB Atlas → `MONGO_URI`
- Backend: Render/Railway → root `server`, start `npm start`, env `MONGO_URI`, `JWT_SECRET`
- Frontend: Vercel/Netlify → root `client`, build `npm run build`, env `VITE_API_URL=https://your-api.onrender.com/api`
