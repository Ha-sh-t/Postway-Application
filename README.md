Perfect — I’ll now add the final sections and then assemble one complete production-ready README.md you can directly paste into your repo.

We’ll add:

✔ Header badges
✔ Screenshot placeholders
✔ MIT License
✔ Final polish
✔ Combined README.md

⸻

✅ FINAL README.md (COMPLETE & READY TO UPLOAD)

Copy–paste this entire file as your README.md.

⸻


<h1 align="center">📮 Postway – Social Networking Platform</h1>

<p align="center">
A full-stack social networking platform that allows users to create posts, like, comment, send friend requests, bookmark posts, manage drafts, and reset passwords using OTP – built with Node.js, MongoDB, and vanilla HTML/CSS/JS.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OTP-Gmail%20API-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-HTML/CSS/JS-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployed%20On-Render-purple?style=for-the-badge" />
</p>

---

# 🚀 Overview
Postway is a feature-rich social networking platform providing:

- 📝 Post creation with text & images  
- ❤️ Likes and 💬 comments  
- 🔐 OTP-based password reset  
- 🤝 Friendship system  
- 🔖 Bookmark, 📦 Draft, 📁 Archive features  
- 👤 User profile updates with avatar uploads  

Frontend is simple HTML/CSS/JS while backend is a full REST API powered by Node.js + MongoDB.

---

# 🛠 Tech Stack

### **Backend**
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- Session-based auth  
- Gmail API (OTP emails)  
- bcrypt (password hashing)  
- Nodemailer  
- Winston logger  

### **Frontend**
- HTML  
- CSS  
- Vanilla JavaScript  

---

# ✨ Features

### 📝 Post Management
- Create/update/delete posts  
- Caption + image upload  
- Only post owner can modify/delete  
- Filter posts by caption  
- Sort posts by engagement/date  
- Pagination  
- Draft & Archive support  
- Bookmark posts  

### 💬 Comment System
- Add/update/delete comments  
- Only owner or post creator can modify/delete  
- Populate user info  
- Pagination support  

### ❤️ Likes
- Toggle like/unlike  
- Like count  
- Populate user details  

### 🤝 Friend System
- Send friend request  
- Accept/Reject requests  
- Toggle friendship  
- Get friend list  
- Pending requests  

### 🔑 OTP Password Reset
- Send OTP via Gmail API  
- Verify OTP  
- Secure password reset flow  

### 👤 User Profile
- Update name, avatar, gender  
- Avatar upload support  

---

# 📁 Project Structure
```bash
postway/
│
backend/
│
├── src/
│   ├── config/               # DB connection, keys, environment
│   ├── controllers/          # All controllers
│   ├── models/               # All mongoose schemas
│   ├── routes/               # All route files
│   ├── middleware/           # Upload, session, validation, auth
│   ├── utils/                # Helper functions
│   ├── services/             # Business logic (optional improvement)
│   ├── repositories/         # Database interaction layers (you already have)
│   ├── uploads/              # Static upload folders
│   └── app.js                # express app setup
│
├── index.js                  # main entry point
├── package.json
├── .env
└── .gitignore
│
└── frontend/
├── index.html
├── styles/
├── scripts/
└── assets/

---
```
# 🧑‍💻 Run Locally

### **Backend**
```bash
cd backend
npm install
npm run start   # or node index.js

.env file:

MONGO_URL=
JWT_SECRET=
EMAIL=
EMAIL_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Frontend

Just open:

frontend/index.html

Or use Live Server.

⸻

📘 API Documentation

Base URL (example)

https://postway-backend.onrender.com

👇 Full API documentation included below.

⸻

🧑‍💻 User APIs — /api/users

POST /api/users/signup

Register a new user.
Body:

{ "name": "Test User", "email": "test@gmail.com", "password": "123456" }

POST /api/users/signin

Login and receive token.

POST /api/users/logout (Protected)

Logout current session.

POST /api/users/logout-all-devices (Protected)

GET /api/users/get-details/:userId (Protected)

GET /api/users/get-all-details (Protected)

PUT /api/users/update-details/:userId (Protected)

Supports avatar upload.

⸻

📝 Posts — /api/posts

POST /api/posts/

Create post with caption & image.

GET /api/posts/all

Fetch all posts.

GET /api/posts/user/:userId

GET /api/posts/:postId

PUT /api/posts/:postId (Protected)

DELETE /api/posts/:postId (Protected)

⸻

Draft APIs
	•	PATCH /draft/save
	•	PATCH /draft/:draftId
	•	GET /draft/all
	•	GET /draft/:draftId
	•	DELETE /draft/:draftId

⸻

Archive APIs
	•	PATCH /archive/:postId
	•	GET /archive
	•	GET /archive/:postId

⸻

Bookmark APIs
	•	PATCH /bookmark/:postId
	•	GET /bookmark

⸻

💬 Comments — /api/comments
	•	POST /:postId
	•	GET /:postId
	•	PUT /:commentId
	•	DELETE /:commentId

⸻

❤️ Likes — /api/likes
	•	POST /toggle/:id
	•	GET /:id

⸻

🤝 Friends — /api/friends
	•	GET /get-friends/:userId
	•	GET /get-pending-requests
	•	POST /toggle-friendship/:friendId
	•	POST /response-to-request/:friendId

⸻

🔑 OTP — /api/otp
	•	POST /send
	•	POST /verify
	•	POST /reset-password

⸻

🚀 Deployment (Render)(..working)

1. Create Web Service
	•	Go to Render → New → Web Service
	•	Connect GitHub repo
	•	Select branch: master

2. Build & Start

Build Command: npm install
Start Command: node backend/index.js

3. Add Environment Variables

MONGO_URL
JWT_SECRET
EMAIL
EMAIL_PASSWORD
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

4. Deploy(on going changes in frontend)

Render will give a URL like:

https://postway-backend.onrender.com

Use this inside frontend JS.

⸻

🖼 Screenshots (later)

![Home Page](./screenshots/home.png)
![User Profile](./screenshots/profile.png)
![Posts](./screenshots/posts.png)

You can add screenshots when ready.

⸻

📄 License

This project is licensed under the MIT License.

⸻

⭐ Show Your Support

If you liked this project:
	•	⭐ Star the repository
	•	🍴 Fork it
	•	🤝 Contribute

⸻

📬 Contact

Developer: Harshit Kumar
GitHub: https://github.com/Ha-sh-t
Project: Postway Application

---  

