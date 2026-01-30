# 🌊 ResumeFlow

**Version control for professional resumes** — because your career evolves, and your resume should track it.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Database](https://img.shields.io/badge/Database-MySQL-blue)

---

## 💡 The Problem

Ever sent a resume link to a recruiter, only to update it later and break the link? Or needed different resume versions for different job applications but struggled to keep track?

**ResumeFlow solves this.**

---

## ✨ What is ResumeFlow?

ResumeFlow is a full-stack web app that brings **Git-style version control** to professional resumes. Just like developers use Git to track code changes, professionals can now track resume changes with:

- 🔒 **Permanent URLs** that never break (even after updates)
- 📦 **Version history** with timestamps
- 🎯 **Locked profiles** for specific job applications
- 📊 **Analytics** to see who's viewing your resume
- 🎨 **Beautiful themes** and customization options

Think of it as **"GitHub for Resumes"** — every change is tracked, every version is saved, and every link stays alive forever.

---

## 🚀 Key Features

### For Job Seekers
✅ **Immutable Versions** — Every save creates a new version. Past versions never disappear.  
✅ **Shareable Links** — Share `resumeflow.com/public/yourname` and it always works.  
✅ **Locked Profiles** — Create custom resume snapshots for specific companies or roles.  
✅ **Live Preview** — See your resume update in real-time as you type.  
✅ **6 Professional Themes** — Modern, Classic, Creative, Technical, Minimal, Professional.

### For Power Users
📊 **Analytics Dashboard** — Track views, devices, geography, and traffic sources.  
🎨 **Customization** — Choose colors, fonts, and layouts that match your style.  
📱 **Mobile Friendly** — Works perfectly on phones, tablets, and desktops.  
🔐 **Secure** — JWT authentication keeps your data safe.

---

## 🛠️ Tech Stack

Built with modern, industry-standard technologies:

### **Frontend**
- **React 18** — The most popular JavaScript library for building UIs
- **Vite** — Lightning-fast build tool (next-gen alternative to Create React App)
- **Tailwind CSS** — Utility-first CSS framework for rapid UI development
- **Lucide React** — Beautiful, consistent icon library (2000+ icons)
- **Recharts** — Composable charting library for analytics visualizations
- **React Router** — Client-side routing for seamless navigation

### **Backend**
- **Node.js + Express** — Fast, minimalist web framework
- **MySQL** — Reliable, production-grade relational database
- **Prisma ORM** — Modern database toolkit with type-safety
- **JWT** — Industry-standard authentication
- **bcrypt** — Secure password hashing

### **Development Tools**
- **Axios** — Promise-based HTTP client
- **ESLint** — Code quality and consistency
- **Nodemon** — Auto-restart on file changes during development

---

## 📸 Screenshots

*(Coming soon — will include Home page, Resume builder, Version control dashboard, Analytics)*

---

## 🎯 How It Works (3 Simple Steps)

1. **Create Your Resume** — Fill in your info using our interactive form
2. **Save Versions** — Each save creates a permanent snapshot
3. **Share & Track** — Get a shareable link and see who viewed it

---

## 🏃 Running Locally

Want to try ResumeFlow on your machine? Follow these simple steps:

### **Prerequisites**
Make sure you have these installed:
- Node.js (v16 or higher) — [Download here](https://nodejs.org/)
- MySQL — [Download here](https://dev.mysql.com/downloads/installer/)
- npm or yarn (comes with Node.js)

---

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/ResumeFlow.git
cd ResumeFlow
```

---

### **Step 2: Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit the `.env` file** and add your database connection:
```env
DATABASE_URL="mysql://username:password@localhost:3306/resumeflow"
JWT_SECRET="your-secret-key-here"
PORT=5000

# Replace 'username' and 'password' with your MySQL credentials
```

**Initialize the database:**
```bash
# Create database tables
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

**Start the backend server:**
```bash
npm start
# Server runs on http://localhost:5000
```

---

### **Step 3: Frontend Setup**

Open a **new terminal window** (keep the backend running):

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**You're all set!** 🎉

Open your browser and visit: **http://localhost:5173**

---

## 📂 Project Structure

```
ResumeFlow/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth & validation
│   ├── prisma/           # Database schema
│   └── server.js         # Entry point
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI pieces
│   │   ├── pages/        # Main pages (Home, Generate, etc.)
│   │   ├── lib/          # Utilities (axios config)
│   │   └── App.jsx       # Root component
│   └── index.html        # HTML template
│
└── README.md             # You are here!
```

---

## 🎨 Available Resume Themes

ResumeFlow offers 6 carefully designed themes:

1. **Professional** — Clean and corporate
2. **Modern** — Bold and contemporary
3. **Creative** — Colorful and eye-catching
4. **Technical** — Perfect for developers
5. **Minimal** — Simple and elegant
6. **Classic** — Traditional and timeless

---

## 🔒 Security Features

- ✅ **Password Hashing** — bcrypt with salt rounds
- ✅ **JWT Tokens** — Secure authentication
- ✅ **Protected Routes** — Middleware guards private data
- ✅ **Input Validation** — Prevents malicious data

---

## 🌟 What Makes This Project Special?

This isn't just another resume builder. Here's what sets it apart:

1. **Real-World Problem** — Solves the "broken resume link" issue
2. **Full-Stack** — Demonstrates both frontend and backend skills
3. **Modern Stack** — Uses current industry tools (React, Tailwind, Prisma)
4. **Production-Ready** — Includes auth, analytics, and error handling
5. **User-Focused** — Clean UI, mobile-responsive, thoughtful UX
6. **Well-Documented** — Clear code comments and README

---

## 🚧 Roadmap (Future Features)

Ideas for future improvements:

- [ ] Export resume as PDF
- [ ] Import from LinkedIn
- [ ] Resume templates marketplace
- [ ] AI-powered resume suggestions
- [ ] Email notifications for views
- [ ] QR code generation
- [ ] Collaboration features
- [ ] Dark mode

---

## 👨‍💻 Author

**Your Name**  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile)  
🐙 [GitHub](https://github.com/yourusername)  
✉️ [Email](mailto:your.email@example.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- **React Team** — For the incredible library
- **Tailwind Labs** — For Tailwind CSS
- **Prisma** — For the amazing ORM
- **Lucide** — For beautiful icons
- **Recharts** — For powerful charts

---

## 💬 Questions or Feedback?

Feel free to open an issue or reach out directly. I'd love to hear your thoughts!

---

<div align="center">
  <strong>Made with ❤️ for better resume management</strong>
  <br />
  ⭐ Star this repo if you found it helpful!
</div>
