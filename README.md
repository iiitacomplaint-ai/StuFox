# 🏫 StuFix [🔗 Live](https://stu-fox.vercel.app)

**StuFix** is a full-stack college complaint management system that bridges the gap between **students**, **maintenance workers**, and **administrators**. Students can submit infrastructure complaints with proof, workers can resolve them efficiently, and admins can track everything — filtered by category, priority, and status. It brings accountability, traceability, and transparency to campus facility management.

---


## 🧠 Why StuFix?

In most college campuses, complaints about broken networks, faulty plumbing, or unclean spaces are still reported through informal channels — WhatsApp messages, verbal requests, or forgotten emails. There is no centralised, auditable system to track whether an issue was ever fixed or who was responsible.

**StuFix** removes this friction by enabling students to report issues with **category selection**, **priority levels**, and **media evidence**, while ensuring that workers from relevant departments can access and resolve these complaints effectively.

To further simplify and secure the system, **email-based OTP verification** has been implemented — users must verify their college email before gaining access. Since the system is designed for campus use, an **Admin manually assigns complaints** to workers based on their department. This brings authenticity to reports while allowing traceability and responsible access.

This system **streamlines student–worker collaboration** — enabling maintenance staff to act more swiftly and efficiently on student reports.

---

## ✨ Features

### 👨‍🎓 For Students
- Submit complaints in **6 categories**: Network, Cleaning, Carpentry, PC Maintenance, Plumbing, Electricity
- Set priority: **Low / Medium / High**
- Upload **image/video proof** as evidence
- Track complaint status in real-time
- View complete **status history** of each complaint
- **Withdraw** a complaint (with reason) while it's still open
- **Reopen** a resolved or withdrawn complaint if unsatisfied
- Personal dashboard with **statistics**: total, pending, resolved, withdrawn

---

### 🛠️ For Workers
- View only complaints **assigned to them** by Admin
- Update status: **Assigned → In Progress → Resolved**
- Add mandatory **resolution remarks** when closing a complaint
- Department-scoped access (e.g., Plumbing worker sees only plumbing complaints)
- Each status change is **logged permanently** for accountability

---

### 👔 For Admin
- **Full visibility** over all complaints across all users and departments
- Assign any complaint to a worker **from the matching department**
- Add or delete worker accounts
- View **analytics dashboard**: complaint counts by status, category, and resolution rate
- Access the **complete audit log** for every complaint
- Enforce role-based access — no unauthorised route access
- Monitor **worker performance** and resolution times

---

### 📝 Audit Trail & Accountability

- Every complaint creation, assignment, status change, withdrawal, and reopening is **immutably logged**
- Complete **status history** visible to students and admins
- **Audit logs** stored in separate table with no UPDATE/DELETE permitted
- Resolution remarks and withdrawal reasons are mandatory and stored permanently

---

## 🔐 Authentication & Security

- ✅ **JWT-based stateless authentication**
- 🎫 **Role-based middleware** protects routes (Student / Worker / Admin)
- 🔒 Passwords hashed with **bcrypt (10+ salt rounds)**
- 📧 **Email OTP verification** required for signup
- 🚫 **CORS whitelist** prevents unauthorised origins
- 🔐 All sensitive credentials stored in **environment variables**
- 🕵️ Passwords and secrets **never appear in logs**

---

## ⚙️ Tech Stack

| Layer        | Stack                                |
|--------------|---------------------------------------|
| Frontend     | React + Vite + Tailwind CSS           |
| Backend      | Node.js + Express                     |
| Database     | PostgreSQL (Supabase hosting)         |
| Media Upload | Cloudinary                            |
| Auth         | JWT, bcrypt, OTP via Email            |
| State/Data   | TanStack Query + Axios Interceptors   |
| Email Service| Nodemailer / Resend API               |

---

## 📁 Environment Configuration

### 📄 server/.env.example
