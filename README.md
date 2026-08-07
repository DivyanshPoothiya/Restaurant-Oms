# Restaurant Order Management System (POC)

A full-stack restaurant order management system with a Node.js backend, React admin dashboard, and React Native mobile app.

---

## 📁 Project Structure

```
restaurant-oms/
├── backend/                     # Node.js + Express + MongoDB
├── admin-dashboard/             # ReactJS (owner/manager panel)
├── mobile-app/                  # React Native (Expo) — customer/waiter app
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**
- **Expo CLI** (for mobile app): `npm install -g expo-cli`

---

## 🔧 Backend Setup

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant-oms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Start MongoDB

Ensure MongoDB is running locally or use a cloud instance (MongoDB Atlas).

### 5. Run the backend server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 6. Create initial admin user

You can register an admin user via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@restaurant.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

## 💻 Admin Dashboard Setup

### 1. Navigate to admin dashboard folder

```bash
cd admin-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Run the dashboard

```bash
npm start
```

Dashboard runs on `http://localhost:3000`

### 5. Login

Use the admin credentials you created in the backend:

- **Email:** `admin@restaurant.com`
- **Password:** `admin123`

---

## 📱 Mobile App Setup (React Native / Expo)

### 1. Navigate to mobile app folder

```bash
cd mobile-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

**Important:** Replace `192.168.1.x` with your **local machine IP address** (not localhost) when testing on a physical device or emulator.

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.100:5000
```

To find your local IP:
- **macOS/Linux:** `ifconfig | grep "inet "`
- **Windows:** `ipconfig`

### 4. Start Expo

```bash
npm start
```

This opens Expo DevTools in your browser.

### 5. Run on device/emulator

- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Physical Device:** Scan QR code with Expo Go app

### 6. Login

Use the same credentials as the admin dashboard, or register a new user with role `waiter` or `kitchen`.

---

## 🎯 Features

### Backend (Node.js + Express + MongoDB)

- **JWT Authentication** (login/register)
- **Role-based Access Control** (admin, manager, waiter, kitchen)
- **CRUD APIs** for Menu, Orders, Tables, Users
- **Socket.io** for real-time order updates
- **Input Validation** (express-validator)
- **Error Handling** middleware
- **MongoDB** with Mongoose ODM

### Admin Dashboard (ReactJS)

- **Dashboard:** Real-time stats, order charts
- **Menu Management:** Add/edit/delete menu items
- **Orders:** View, filter, update order status
- **Tables:** Manage tables, view occupancy
- **Staff Management:** Add/edit/delete staff members (admin/manager only)
- **Socket.io Client:** Live order notifications
- **Protected Routes:** Role-based access

### Mobile App (React Native / Expo)

- **Customer Flow:**
  - Browse menu
  - Add items to cart
  - Place orders
  - Track order status in real-time
- **Waiter/Staff Flow:**
  - View all orders
  - Update order status
- **Socket.io Client:** Live order updates
- **Context API:** Auth & Cart state management
- **Bottom Tab Navigation**

---

## 🔐 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | `/register` | Register new user | ❌ | — |
| POST | `/login` | Login user | ❌ | — |
| GET | `/me` | Get current user | ✅ | All |

### Menu Routes (`/api/menu`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Get all menu items | ❌ | — |
| GET | `/:id` | Get single menu item | ❌ | — |
| POST | `/` | Create menu item | ✅ | admin, manager |
| PUT | `/:id` | Update menu item | ✅ | admin, manager |
| DELETE | `/:id` | Delete menu item | ✅ | admin, manager |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Get all orders | ✅ | All |
| GET | `/:id` | Get single order | ✅ | All |
| POST | `/` | Create order | ✅ | All |
| PUT | `/:id` | Update order | ✅ | admin, manager, waiter |
| PATCH | `/:id/status` | Update order status | ✅ | admin, manager, waiter, kitchen |
| DELETE | `/:id` | Delete order | ✅ | admin, manager |

### Table Routes (`/api/tables`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Get all tables | ✅ | All |
| GET | `/:id` | Get single table | ✅ | All |
| POST | `/` | Create table | ✅ | admin, manager |
| PUT | `/:id` | Update table | ✅ | admin, manager, waiter |
| DELETE | `/:id` | Delete table | ✅ | admin, manager |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Get all users | ✅ | admin, manager |
| GET | `/:id` | Get single user | ✅ | admin, manager |
| PUT | `/:id` | Update user | ✅ | admin, manager |
| DELETE | `/:id` | Delete user | ✅ | admin |

---

## 🔌 Socket.io Events

### Server → Client

- **`newOrder`**: Emitted when a new order is created
- **`orderStatusUpdated`**: Emitted when order status changes

### Client → Server

- **`joinRoom`**: Join a specific room (e.g., 'kitchen')
- **`leaveRoom`**: Leave a room

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express, MongoDB, Mongoose, Socket.io |
| **Admin Dashboard** | React, React Router, Axios, Socket.io Client, Recharts |
| **Mobile App** | React Native, Expo, React Navigation, Socket.io Client |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Validation** | express-validator |
| **Styling** | CSS (Admin), React Native StyleSheet (Mobile) |

---

## 📝 Environment Variables Summary

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant-oms
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Admin Dashboard (`.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Mobile App (`.env`)

```env
EXPO_PUBLIC_API_URL=http://192.168.1.x:5000/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.x:5000
```

---

## 🧪 Testing the System

### 1. Start all services

- **Terminal 1:** Backend (`cd backend && npm run dev`)
- **Terminal 2:** Admin Dashboard (`cd admin-dashboard && npm start`)
- **Terminal 3:** Mobile App (`cd mobile-app && npm start`)

### 2. Create test data

Use the admin dashboard to:
- Add menu items
- Create tables
- Add staff members

### 3. Place an order

Use the mobile app to:
- Browse menu
- Add items to cart
- Place order

### 4. Watch live updates

- Admin dashboard should show the new order in real-time
- Update order status from admin dashboard
- Mobile app should reflect status changes in real-time

---

## 🚧 Known Limitations (POC)

- No payment gateway integration (stub only)
- No image upload (use URLs for menu item images)
- No push notifications (Socket.io only)
- No analytics/reporting module
- Basic error handling
- No unit/integration tests
- No production-ready security hardening

---

## 📚 Next Steps for Production

1. **Security:**
   - Add rate limiting
   - Implement HTTPS
   - Add CORS whitelist
   - Sanitize inputs
   - Add request logging

2. **Features:**
   - Payment gateway integration (Stripe, Razorpay)
   - Image upload (AWS S3, Cloudinary)
   - Push notifications (FCM, APNS)
   - Email notifications
   - Reports & analytics
   - Multi-restaurant support

3. **Testing:**
   - Unit tests (Jest)
   - Integration tests (Supertest)
   - E2E tests (Cypress, Detox)

4. **Deployment:**
   - Backend: AWS EC2, Heroku, DigitalOcean
   - Database: MongoDB Atlas
   - Admin: Vercel, Netlify
   - Mobile: Expo EAS Build → App Store / Play Store

---

## 📄 License

This is a POC project for demonstration purposes.

---

## 🤝 Contributing

This is a proof-of-concept. Feel free to fork and extend!

---

## 📧 Contact

For questions or support, reach out to your development team.

---

**Happy Coding! 🚀🍴**
