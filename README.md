<div align="center">

<h1>🏫 StuFix</h1>
<p><strong>College Complaint Management System</strong></p>

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-stu--fox.vercel.app-blue?style=for-the-badge)](https://stu-fox.vercel.app)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-316192?style=for-the-badge&logo=postgresql)](https://supabase.com)

<p>
  A full‑stack web application that digitises and streamlines the process of lodging, tracking, and resolving infrastructure and service complaints within a college campus — bringing <strong>transparency, accountability, and efficiency</strong> to campus facility management.
</p>

</div>

---

## 🧠 Why StuFix?

In most college campuses, complaints about broken networks, faulty plumbing, or unclean spaces are still reported through informal channels — WhatsApp messages, verbal requests, or forgotten emails. There is no centralised, auditable system to track whether an issue was ever fixed or who was responsible.

**StuFix** solves this by providing:

- 📋 A structured, category‑wise complaint submission portal for students
- 🔧 A role‑based dashboard for workers to update resolution progress
- 👁️ Full visibility and assignment control for administrators
- 📜 An immutable audit trail of every action — creating accountability

---

## ✨ Features

<details>
<summary><strong>👨‍🎓 For Students</strong></summary>

- Submit complaints under **6 categories**: Network, Cleaning, Carpentry, PC Maintenance, Plumbing, Electricity
- Set priority: **Low / Medium / High**
- Upload **image/video evidence** (stored securely on Cloudinary)
- Track complaint status in **real time**
- View full **status history** of each complaint
- **Withdraw** a complaint (with reason) while it is still open
- **Reopen** a resolved or withdrawn complaint if unsatisfied
- Personal dashboard with statistics: total, pending, resolved, withdrawn

</details>

<details>
<summary><strong>🛠️ For Workers (Maintenance Staff)</strong></summary>

- Log in to a **department‑scoped** dashboard
- View only complaints **assigned to them** by the admin
- Update status: `Assigned → In Progress → Resolved`
- Add mandatory **resolution remarks** when closing a complaint
- Each status change is **logged permanently**

</details>

<details>
<summary><strong>👔 For Admin (Administrator)</strong></summary>

- **Full visibility** over all complaints (across all users, departments)
- Assign any complaint to a worker from the matching department
- Add or delete worker accounts
- View **analytics dashboard**: complaint counts by status, category, and resolution rate
- Access the **complete audit log** for every complaint
- Enforce role‑based access — no unauthorised route access

</details>

---

## 🔐 Authentication & Security

| Feature | Detail |
|---|---|
| Authentication | JWT‑based stateless auth |
| Access Control | Role‑based middleware (User / Worker / Admin) |
| Password Hashing | bcrypt with 10+ salt rounds |
| Signup Verification | Email OTP required |
| CORS | Whitelist prevents unauthorised origins |
| Credentials | Stored in environment variables, never logged |

---

## 🧾 Audit Trail & Accountability

Every significant action is **immutably logged** in the database:

- ✅ Complaint creation / withdrawal / reopening
- ✅ Worker assignment (by admin)
- ✅ Every status change — old → new, who changed it, when
- ✅ Resolution remarks and withdrawal reasons

> ⚠️ No `UPDATE` or `DELETE` is permitted on the `audit_logs` table.

---

## ⚙️ Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React.js + Vite + Tailwind CSS |
| Backend | Node.js + Express.js (REST API) |
| Database | PostgreSQL 14+ (hosted on Supabase) |
| Media Storage | Cloudinary (CDN for images/videos) |
| Authentication | JWT, bcrypt, OTP via Email (Nodemailer / Resend) |
| HTTP Client | TanStack Query + Axios Interceptors |
| Deployment | Client: Vercel · Server: Render |

---

## 📊 Database Schema

| Table | Purpose |
|---|---|
| `users` | All accounts (students, workers, admin) with role & department |
| `complaints` | Main complaint record — title, description, category, priority, status, media URLs |
| `status_history` | Immutable log of every status transition per complaint |
| `audit_logs` | Immutable system‑wide action log |

> 📎 A full Entity‑Relationship Diagram is available in the SRS (Appendix B.2).

---

## 🚀 Getting Started (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/iiitacomplaint-ai/StuFix.git
cd StuFix

# 2. Backend setup
cd server
cp .env.example .env        # Add your real credentials
npm install
npm run dev                 # Runs on http://localhost:3000

# 3. Frontend setup (open another terminal)
cd ../client
cp .env.example .env        # Point to your backend URL
npm install
npm run dev                 # Runs on http://localhost:5173
```

> **Note:** You will need a running PostgreSQL instance (local or remote) and a Cloudinary account with an unsigned upload preset for media uploads to work.

---

## 📁 Environment Configuration

<details>
<summary><strong>📄 server/.env</strong></summary>

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
PORT=3000

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

EMAIL_SERVICE=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OTP_SECRET=your_otp_secret_for_jwt
```

</details>

<details>
<summary><strong>📄 client/.env</strong></summary>

```env
VITE_API_BASE_URL=https://your-backend-url.com/api

VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/auto/upload
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

</details>

---

## 🧪 Testing the System

### Sample Accounts

| Role | Email | Password |
|---|---|---|
| Student | `student@iiita.ac.in` | `Student@123` |
| Worker | `worker@iiita.ac.in` | `Worker@123` |
| Admin | `admin@iiita.ac.in` | `Admin@123` |

> The admin account is seeded automatically when the server starts if it does not already exist.

### Key API Endpoints `(base: /api)`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/send-otp` | Request OTP for signup / reset |
| `POST` | `/auth/verify-otp` | Verify OTP and get token |
| `POST` | `/auth/login` | Login and receive JWT |
| `POST` | `/auth/reset-password` | Reset password using OTP token |
| `GET` | `/user/my-complaints` | List logged‑in user's complaints |
| `POST` | `/user/complaint` | Create a new complaint |
| `PUT` | `/user/complaint/withdraw` | Withdraw a complaint |
| `PUT` | `/user/complaint/reopen` | Reopen a complaint |
| `GET` | `/admin/all-complaints` | *(Admin)* View all complaints |
| `PUT` | `/admin/assign` | *(Admin)* Assign complaint to worker |
| `GET` | `/worker/assigned-complaints` | *(Worker)* View assigned complaints |
| `PUT` | `/worker/update-status` | *(Worker)* Change complaint status |

---

## 🏆 Project Status & Roadmap

**Version 1.0** (April 2025 – April 2026) — Full functionality as described above.

**Planned for future releases:**

- [ ] SLA‑based automatic escalation (e.g., unresolved after 3 days → escalated)
- [ ] Real‑time notifications (WebSockets / FCM) for status updates
- [ ] User leaderboard based on resolved complaints (gamification)
- [ ] Internationalisation (i18n) for multiple languages

---

## 👥 Contributors

| Name | Role |
|---|---|
| Abhishek Kumar | Developer |
| Nitin Kumar | Developer |
| Aashray Mahajan | Developer |
| Laxmi Narayan Meena | Developer |

**Department of Information Technology**
Indian Institute of Information Technology, Allahabad
Academic Year 2024–2025

---

## 📄 License & Acknowledgements

This project was developed as a browser‑based software system for academic evaluation. It uses open‑source components:

`Express.js` · `React` · `Tailwind CSS` · `PostgreSQL` · `Cloudinary` · `bcrypt` · `jsonwebtoken`

Special thanks to the faculty of **IIIT Allahabad** for guidance and evaluation.

---

<div align="center">
  <sub>Built with ❤️ by students of IIIT Allahabad</sub>
</div>
