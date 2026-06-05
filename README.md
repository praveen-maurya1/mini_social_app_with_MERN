# Mini Social App (MERN Stack)

A full-stack social media application built using the MERN stack. Users can register, verify their email through OTP, log in securely, create posts, like posts, and comment on posts.

## Features

### Authentication

* User Registration
* Email OTP Verification
* JWT Authentication
* User Login
* Logout

### Social Features

* Create Posts
* View Feed
* Like / Unlike Posts
* Add Comments
* View Likes & Comments Count

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap
* Vite

### Backend

* Node.js
* Express.js
* JWT
* Nodemailer

### Database

* MongoDB Atlas
* Mongoose

## Project Structure

```text
mini_social_app_with_MERN
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── app.js
│   │
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

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
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/verify-otp
POST /api/auth/login
```

### Posts

```http
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id/like
POST   /api/posts/:id/comment
```

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Author

Praveen Maurya

Linkedin: https://www.linkedin.com/in/praveen-maurya-722a393a1