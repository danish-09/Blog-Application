# Blog Application (Full-Stack)

A basic full-stack blog application built using **Node.js**, **Express**, **PostgreSQL**, **Passport.js**, and **EJS** templating. 
This app enables users to sign up, log in, create blogs, logout and view blogs from all users. 

---

##  Features

- 🔐 Secure user authentication (email/password + Google OAuth 2.0)
- 🎨 Dynamic frontend using EJS templates
- 🗂 Login persistence
- 🧂 Password hashing with `bcrypt`
- 🛡 Protected routes using Passport.js middleware

---

##  Tech Stack

**Frontend**:  
- HTML, CSS, JavaScript  
- EJS (Embedded JavaScript templating)

**Backend**:  
- Node.js, Express.js 
- PostgreSQL  
- Passport.js (Local Strategy & Google OAuth 2.0)

**Other**:  
- express-session, bcrypt, dotenv, pg

---

## 🗂️ Project Structure

project-root/ │ ├── public/ # Static assets (CSS, images) ├── views/ # EJS templates for frontend rendering │ ├── signin.ejs │ ├── signup.ejs │ ├── posts.ejs │ └── ... │ ├── .env # Environment variables (not tracked in Git) ├── .gitignore ├── package.json └── index.js # Main server file



