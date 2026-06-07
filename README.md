# Mini Social Media Application (MySocialMedia)

A full-stack social media application built using the MERN stack. Users can create accounts, verify their email using OTP, create posts, like posts, and interact through a public social feed.

## Live Demo

### Frontend

https://mysocialmedia-alpha.vercel.app

### Backend API

https://socialmedia-mkqg.onrender.com

---

## Features

### Authentication

* User Registration
* Email OTP Verification
* User Login
* JWT Authentication
* Refresh Token Authentication
* Session Management
* Protected Routes
* Logout
* Logout From All Devices

### Social Features

* Create Posts
* Public Feed
* Like Posts
* View Like Counts
* View Comment Counts
* Responsive User Interface

### Security Features

* Password Hashing
* JWT Access Tokens
* Refresh Tokens stored in HTTP-only Cookies
* Email Verification before Login
* Session Revocation

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Bootstrap
* React Bootstrap

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* Nodemailer
* Brevo SMTP
* Cookie Parser
* CORS

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Project Structure

```text
Mini Social Media Application
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vercel.json
│
└── backend
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── middleware
    │   ├── models
    │   ├── routes
    │   ├── services
    │   └── utils
    ├── server.js
    └── package.json
```

---

## Environment Variables

### Backend (.env)

```env
MONGO_URI=

JWT_SECRET=

PORT=

SMTP_HOST=

SMTP_PORT=

SENDER_EMAIL=

SMTP_PASS=

SMTP_USER=

CLIENT_URL=
```

### Frontend (.env)

```env
VITE_API_URL=
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/praveen-maurya1/mini_social_app_with_MERN.git

cd mini_social_app_with_MERN
```

### Backend Setup

```bash
cd backend

npm install

npm start
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Authentication Flow

```text
Signup
   ↓
Email OTP Verification
   ↓
Login
   ↓
Access Token + Refresh Token
   ↓
Create Posts
   ↓
Like Posts
   ↓
Logout
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/refresh-token
GET  /api/auth/logout
GET  /api/auth/logout-all
```

### Posts

```http
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id/like
```

---

## Deployment

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

### Email Service

Brevo SMTP

---

## Author

Praveen Maurya

GitHub:
https://github.com/praveen-maurya1

Linkedin: https://www.linkedin.com/in/praveen-maurya-722a393a1