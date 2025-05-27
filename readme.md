# NoteSphere

A full-stack note-taking app built with **React.js**, **Node.js**, and **PostgreSQL**, featuring JWT authentication, CRUD operations, and a responsive dashboard UI. (jwt for authenticate and fetching data using token) production level foldering and backend.

---

## 🔧 Tech Stack

### Frontend

- **React.js**
- **Tailwind CSS** – For UI styling
- **React Router DOM** – For routing

### Backend

- **Node.js**
- **Express.js** – REST API framework
- **PostgreSQL** – Relational database
- **bcryptjs** – For password hashing
- **jsonwebtoken** – For authentication tokens
- **dotenv** – To load environment variables
- **pg** – PostgreSQL client for Node.js

---

## 📁 Folder Structure

```
project-root/
├── app/                # Frontend (React)
│   ├── src/
│   │   ├── Services/    (Api integration from backend)
│   │   │   └── note.js
│   │   │   └── auth.js
│   │   ├── components/
│   │   │    └── LoginForm.jsx
│   │   │    └── registerform.jsx
│   │   └── pages/
│   │       └── Dashboard.jsx
│   │       └── loginpage.jsx
│   │       └── registerpage.jsx
│   ├── App.jsx
│   └── main.jsx
│
├── backend/                # Backend (Node.js)
│   ├── controllers/
│   │   └── authController.js
│   │   └── notesController.js
│   ├── routes/
│   │   └── authRoutes.js
│   │   └── notesRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── generatetoken.js
│   │   └── hashpassword.js    (for bycrypt password)
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── usermodel.js
│   │   └── notesmodel.js
│   ├── .env
│   └── index.js
```

---

## 📦 Dependencies

### Backend

```bash
npm install express pg bcryptjs jsonwebtoken dotenv cors
```

### Dev dependencies (Optional)

```bash
npm install --save-dev nodemon
```

### Frontend

```bash
npm install react-router-dom axios tailwindcss postcss autoprefixer
```

Set up Tailwind:

```bash
npx tailwindcss init -p
```

---

## 🔐 Environment Variables (Backend)

Create a `.env` file in the `server` directory:

## 🧠 Features

- ✅ User Authentication (Signup, Login)
- ✅ JWT-based secure access
- ✅ Create, Read, Update, Delete (CRUD) for notes(protected)
- ✅ Responsive UI with Tailwind CSS
- ✅ Logout and token clearance
- ✅ Form validation and error handling

---

## ▶️ Getting Started

### 1. Clone the repo:

```bash
git clone https://github.com/mohammadbinmazi/notes-dashboard-app.git
```

### 2. Backend setup

```bash
cd server
npm install
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Notes (Protected)

- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

---

## 🛡 Auth Middleware

Every protected route should be accessed only with a valid JWT token passed via headers:

```http
Authorization: Bearer <your_token_here>
```

---

## 📌 Final Notes

This is a beginner-friendly, fully functional full-stack app designed to teach how modern web apps are built with React and Node ,express. Customize and scale it however you want! it is for learning jwt in details

---

## 📃 License

MIT

-
