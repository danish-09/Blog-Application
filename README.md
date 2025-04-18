# 📝 Blog Application (Full-Stack)

A full-stack blog application built using **Node.js**, **Express**, **PostgreSQL**, **Passport.js**, and **EJS** templating. 
This app enables users to sign up, sign in, create blogs, logout and view blogs from all users.

---

##  Features

-  Secure user authentication (email/password + Google OAuth 2.0)
-  Dynamic frontend using EJS templates
-  login persistence and database integration
-  Password hashing with advanced `bcrypt` algorithm
-  Protected routes using Passport.js middleware

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

### Prerequisites
- Node.js installed
- bcrypt installed
- dotenv installed
- ejs installed
- express-session installed
- passport installed
- passport-google-oauth2 installed
- passport-local installed
- pg installed


## License
This project is open-source and available under the MIT License. 



## Usage
 - Clone the repository
 - Navigate to project directory
 - Install dependencies using `npm install`
 - Start server using `node index.js`
 - Open browser and navigate to `http://localhost:3000/`

 - Setup Google OAuth by using google cloud console set authorised javascript origin to set http://localhost:3000, authorized redirect url to http://localhost:3000/auth/google/posts
 - PostgreSQL database setup: Make sure your database has following tables
 - - CREATE TABLE users (id SERIAL PRIMARY KEY,email VARCHAR(255) UNIQUE NOT NULL,password_hash TEXT);
   CREATE TABLE posts (id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,blog_title TEXT NOT NULL,blog_content TEXT NOT NULL);
 - Create an .env file in root directory with the following variables
   PG_USER=your_postgres_username
   PG_HOST=your_postgres_host
   PG_DATABASE=your_database_name
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   SESSION_SECRET=your_session_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret


## Contributions
- Fork the repository
- Create a new branch
  `git checkout -b feature-branch`
- Make your changes and commit them
  `git commit -m "Describe your changes"`
- Push the changes to your forked repository
  `git push origin feature-branch`
- Open a pull request.



