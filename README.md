# Project Name

## 📌 Overview

This project is a complete backend application built using **Node.js, Express, and PostgreSQL**. It includes secure authentication, role-based access control, validations, and structured project architecture following best practices.

## ✨ Features

* User Registration & Login
* JWT-based Authentication
* Forgot / Reset Password Flow
* Role-based Authorization
* Rate Limiting for Auth APIs
* Input Validation
* Secure Password Hashing
* PostgreSQL with Sequelize ORM
* Modular & Scalable Folder Structure

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **ORM:** Sequelize
* **Authentication:** JWT
* **Security:** bcrypt, rate-limiters
* **Environment Management:** dotenv

## 📂 Project Structure

```
src/
├── controllers/
├── services/
├── routes/
├── models/
├── middlewares/
├── validators/
├── constants/
├── utils/
├── config/
└── app.js
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```
PORT=3000
DATABASE_URL=localhost
JWT_SECRET=your_jwt_secret
```

## ▶️ Running the Project

```bash
npm install
npm run dev
```

## 🧪 API Endpoints (Sample)

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/auth/register        | Register user   |
| POST   | /api/auth/login           | Login user      |
| POST   | /api/auth/forgot-password | Forgot password |
| POST   | /api/auth/reset-password  | Reset password  |

## 🔐 Security Notes

* Passwords are hashed using bcrypt
* Login attempts are limited
* JWT tokens are securely generated

## 🚀 Deployment

* Configure environment variables
* Run database migrations
* Start the server using `npm start`

## 👤 Author

**Arunkumar Sengamalam**

## 📄 License

This project is licensed under the MIT License
