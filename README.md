# Enterprise HRMS & Payroll Automation System

A full-stack Human Resource Management System (HRMS) designed to streamline employee management, department administration, leave management, and payroll processing.

This project was developed using the MERN stack with TypeScript, following a modular and scalable architecture.

---

## Features

### Authentication & Authorization
- User Registration
- Secure Login
- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes

### Department Management
- Create Department
- View Departments
- Update Department
- Delete Department

### Employee Management
- Add Employees
- View Employee Records
- Edit Employee Details
- Delete Employees

### Leave Management
- Submit Leave Requests
- View Leave Records
- Delete Leave Requests

### Payroll Management
- Generate Payroll
- View Payroll Records
- Delete Payroll Records

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## Project Structure

```
client/
│── src/
│── components/
│── pages/
│── services/

server/
│── src/
│── controllers/
│── routes/
│── middleware/
│── models/
│── config/
│── utils/
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
```

### Install Frontend

```bash
cd client
npm install
```

### Install Backend

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Run the Project

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

## Modules

- Authentication
- Authorization (RBAC)
- Department Management
- Employee Management
- Leave Management
- Payroll Management

---

## Future Enhancements

- Attendance Management
- Performance Management
- Reports & Analytics
- Email Notifications
- AI-powered HR Assistant
- Dashboard Analytics

---

## Learning Outcomes

This project helped strengthen my understanding of:

- Full-stack application development
- REST API design
- JWT Authentication
- Role-Based Access Control
- MongoDB data modeling
- CRUD operations
- React with TypeScript
- Backend architecture using Express.js

---

## License

This project is created for educational and internship purposes.
