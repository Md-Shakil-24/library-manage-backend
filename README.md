# 📚 Library Management System - Backend

This is the backend server for a **Library Management System** built with **Node.js**, **Express**, **MongoDB**, and **Firebase Authentication**. It allows users to perform CRUD operations on books and borrow or return books with secure authentication.

## 🚀 Features

- 📖 Add, update and view books.
- 🔐 Secure book borrowing system with Firebase JWT verification.
- 📬 Track borrowed books by user email.
- 🔁 Return borrowed books and update inventory.
- 🔒 Route protection using Firebase ID tokens.

---

## 🛠️ Technologies Used

- **Node.js** + **Express.js** – Web server
- **MongoDB** – Database for storing books and borrow records
- **Firebase Admin SDK** – For verifying JWT tokens
- **dotenv** – To manage environment variables
- **cors** – To enable cross-origin requests

---

## 📦 NPM Packages

- **✅ express**
  - 📦 `npm install express`
  - 🛠 Used to create the server, API routes, and handle HTTP requests/responses.

- **✅ cors**
  - 📦 `npm install cors`
  - 🛠 Allows cross-origin requests so your frontend can access this backend.

- **✅ dotenv**
  - 📦 `npm install dotenv`
  - 🛠 Loads environment variables (like DB credentials) from `.env` into `process.env`.

- **✅ mongodb**
  - 📦 `npm install mongodb`
  - 🛠 Connects your backend to MongoDB and performs CRUD operations on books/borrowed data.

- **✅ firebase-admin**
  - 📦 `npm install firebase-admin`
  - 🛠 Verifies Firebase JWT tokens to protect routes like borrowing and returning books.

- **✅ nodemon** (development only, optional)
  - 📦 `npm install --save-dev nodemon`
  - 🛠 Automatically restarts the server when changes are made (great for development).

 
