# HealthConnect - Medical Management SaaS Platform

HealthConnect is a professional, full-stack MERN (MongoDB, Express, React, Node.js) application designed to bridge the gap between patients and healthcare providers. It offers a seamless, real-time experience for booking appointments, managing medical records, and direct communication.

## ✨ Key Features

### 🔐 Secure Authentication
- Role-based access control for **Patients**, **Doctors**, and **Admins**.
- Secure JWT-based authentication and password hashing.
- Persistent sessions with local storage integration.

### 📅 Appointment System
- **Patients**: Browse specialized doctors, view available slots, and book appointments instantly.
- **Doctors**: Manage incoming requests, accept/reject appointments, and track daily schedules.
- **Admins**: Oversight of all system-wide bookings and status monitoring.

### 💬 Real-Time Communication
- Instant chat between patients and doctors powered by **Socket.io**.
- Support for **Image** and **Document** sharing within chat sessions.
- Global **Notification System** with real-time badges in the navigation bar.

### 👤 Profile Management
- Detailed profile editing for all user roles.
- **Doctor Profiles**: Specialization, years of experience, consultation fees, and professional bio.
- **File Uploads**: Integrated profile picture management and medical document storage.

### 🎨 Modern Aesthetic
- Clean, clinical "Pure White" design system.
- Fully responsive layout for mobile, tablet, and desktop.
- Interactive UI elements with smooth transitions and hover effects.

## 🚀 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Socket.io-client, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Real-Time**: Socket.io.
- **File Handling**: Multer (Local storage / Static serving).
- **Auth**: JSON Web Tokens (JWT).

## 🛠️ Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB database (Local or Atlas).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/10viraj/Software-as-a-service.git
   cd Software-as-a-service
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
   Start the server:
   ```bash
   npm start (or nodemon server.js)
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📸 Project Structure

```text
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth & Global state
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Routing logic
├── server/                # Node.js backend
│   ├── controllers/       # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── uploads/           # Static file storage
│   └── server.js          # Main entry point
└── README.md
```

## 📄 License
This project is licensed under the MIT License.
