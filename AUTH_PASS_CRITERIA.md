# Sprint 2 - Authentication Pass Criteria

## Overview
This document defines the acceptance criteria for Sprint 2 (Authentication).

---

## Backend API Tests

### Registration
- [ ] `POST /api/v1/auth/register` creates a new user and returns 201
- [ ] `POST /api/v1/auth/register` validates username (3-50 chars required)
- [ ] `POST /api/v1/auth/register` validates email (valid email format)
- [ ] `POST /api/v1/auth/register` validates password (min 6 chars)
- [ ] `POST /api/v1/auth/register` returns 409 for duplicate username
- [ ] `POST /api/v1/auth/register` returns 409 for duplicate email
- [ ] Password is hashed (not stored in plain text)

### Login
- [ ] `POST /api/v1/auth/login` returns 200 with JWT token for valid credentials
- [ ] `POST /api/v1/auth/login` returns 401 for wrong password
- [ ] `POST /api/v1/auth/login` returns 401 for non-existent user
- [ ] JWT token expires after configured time

### Protected Endpoint
- [ ] `GET /api/v1/auth/me` returns 200 with user data for valid token
- [ ] `GET /api/v1/auth/me` returns 401 for missing token
- [ ] `GET /api/v1/auth/me` returns 401 for invalid/expired token

---

## Frontend Tests

### Login Page (/login)
- [ ] Page renders with glassmorphism styling
- [ ] Username and password inputs are functional
- [ ] Submit button triggers login API call
- [ ] Loading state shown during login
- [ ] Error message displayed on 401 (wrong credentials)
- [ ] Redirects to /board on successful login

### Register Page (/register)
- [ ] Page renders with glassmorphism styling
- [ ] Username, email, password inputs are functional
- [ ] Password confirmation input works
- [ ] Validation: password must match confirmation
- [ ] Validation: password min 6 characters
- [ ] Submit button triggers registration API call
- [ ] Redirects to /board on successful registration

### Board Page (/board) - Protected
- [ ] Redirects to /login if not authenticated
- [ ] Shows welcome message with username
- [ ] Logout button is functional
- [ ] Logout clears token and redirects to /login

### AuthContext
- [ ] Token stored in localStorage
- [ ] `isAuthenticated` returns true when logged in
- [ ] `isAuthenticated` returns false when logged out
- [ ] User data is fetched on app load if token exists

### Root Page (/)
- [ ] Redirects to /login by default

---

## Happy Path Test
1. Navigate to /
2. Redirected to /login
3. Click "Sign up" link
4. Navigate to /register
5. Fill registration form
6. Submit -> Success
7. Redirected to /board
8. See welcome message with username
9. Click "Logout"
10. Redirected to /login

---

## Rebel Path Tests

### Wrong Password
1. Navigate to /login
2. Enter valid username, wrong password
3. Submit -> 401 error
4. Error message: "Incorrect username or password"

### Non-existent User
1. Navigate to /login
2. Enter non-existent username
3. Submit -> 401 error
4. Error message: "Incorrect username or password"

### Duplicate Registration
1. Navigate to /register
2. Register with username "testuser"
3. Success -> logged in
4. Logout
5. Navigate to /register
6. Register with same username "testuser"
7. Error: "Username already registered"

### Invalid Token
1. Open browser dev tools
2. Manually modify localStorage token to invalid value
3. Refresh page
4. Should redirect to /login
5. No 401 errors shown to user

---

## Sign-off

| Role | Agent | Status |
|------|-------|--------|
| QA | #04 | Pending |
| Orchestrator | #01 | Approved |
