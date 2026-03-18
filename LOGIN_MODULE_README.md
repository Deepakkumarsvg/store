# Login Module Setup

## Overview
A complete login authentication system has been implemented for the StockForge application using JWT (JSON Web Tokens).

## Features
- ✅ Secure login with email and password
- ✅ JWT token-based authentication
- ✅ Protected routes (requires login)
- ✅ Auto-redirect to login page if not authenticated
- ✅ Logout functionality
- ✅ Password hashing with bcrypt
- ✅ Token stored in localStorage
- ✅ User information displayed in navbar

## Backend Components

### 1. User Model (`models/User.js`)
- Schema for user data (name, email, password, role, status)
- Password hashing before saving
- Password comparison method
- Fields: name, email, password, role (admin/user/manager), status (Active/Inactive)

### 2. Auth Routes (`routes/auth.js`)
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current user info (protected)
- `POST /api/auth/logout` - Logout (protected)

### 3. Auth Middleware (`middleware/auth.js`)
- `protect` - Verify JWT token and authenticate user
- `authorize` - Grant access based on user roles

### 4. Environment Variables (`.env`)
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRE=30d
```

## Frontend Components

### 1. Login Page (`src/pages/Login.jsx`)
- Beautiful login form with gradient background
- Email and password inputs
- Error handling and loading states
- Auto-redirect after successful login

### 2. Auth Context (`src/context/AuthContext.jsx`)
- Global authentication state management
- Methods: `login()`, `logout()`
- Properties: `user`, `token`, `isAuthenticated`, `loading`

### 3. Protected Route (`src/components/ProtectedRoute.jsx`)
- Wrapper component for protected routes
- Redirects to login if not authenticated
- Shows loading state while checking auth

### 4. Updated Components
- **App.jsx**: Wrapped with AuthProvider and added login route
- **Navbar.jsx**: Shows user info and logout button
- **API Service**: Auto-adds JWT token to all requests

## Default Credentials

A default admin user has been created:

```
Email: admin@stockforge.com
Password: admin123
```

## How to Use

### 1. Start the Backend
```bash
cd StockForge-backend
npm start
```

### 2. Start the Frontend
```bash
cd StockForge
npm run dev
```

### 3. Access the Application
- Navigate to `http://localhost:5173`
- You'll be redirected to the login page
- Use the default credentials to login

### 4. Create More Users
You can create more users by modifying and running the `seedUser.js` script:
```bash
cd StockForge-backend
node seedUser.js
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt before storing
2. **JWT Tokens**: Secure token-based authentication
3. **Token Expiration**: Tokens expire after 30 days
4. **Protected Routes**: All routes require authentication
5. **Auto Logout**: Invalid/expired tokens trigger automatic logout

## API Request Flow

1. User logs in → Receives JWT token
2. Token stored in localStorage
3. All API requests include token in Authorization header
4. Backend middleware verifies token
5. If valid → Request proceeds
6. If invalid → 401 error → Auto redirect to login

## Folder Structure

```
StockForge-backend/
├── models/
│   └── User.js
├── routes/
│   └── auth.js
├── middleware/
│   └── auth.js
├── seedUser.js
└── .env

StockForge/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   └── Login.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   └── Layout/
│   │       └── Navbar.jsx
│   └── services/
│       └── api.js
```

## Troubleshooting

### Can't login?
- Make sure MongoDB is running
- Check that the backend server is running on port 5000
- Verify the credentials are correct

### Token expired?
- The app will automatically logout and redirect to login
- Just login again to get a new token

### Want to change JWT secret?
- Update `JWT_SECRET` in `.env` file
- Remember to keep it secret in production!

## Future Enhancements (Not Implemented)
- User registration (intentionally excluded per requirements)
- Forgot password functionality
- Email verification
- Role-based access control UI
- User management page
