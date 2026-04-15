# CodeX — Library Management System

A full-stack library management system built with React, Node.js, Express, PostgreSQL and Prisma.

---

## Project Structure

```
library-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── bookController.js
│   │   │   ├── borrowController.js
│   │   │   ├── fineController.js
│   │   │   ├── userController.js
│   │   │   ├── reservationController.js
│   │   │   └── reportController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── client.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── books.js
│   │   │   ├── users.js
│   │   │   ├── borrows.js
│   │   │   ├── fines.js
│   │   │   ├── reservations.js
│   │   │   └── reports.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Books.jsx
    │   │   ├── Members.jsx
    │   │   ├── BorrowReturn.jsx
    │   │   ├── Fines.jsx
    │   │   ├── MyBorrows.jsx
    │   │   └── Reports.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---


### Auth
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Protected | Get current user |

### Books
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/books | All | List books (search, category filter) |
| GET | /api/books/:id | All | Get single book |
| POST | /api/books | Librarian, Admin | Add book |
| PUT | /api/books/:id | Librarian, Admin | Update book |
| DELETE | /api/books/:id | Admin | Delete book |
| GET | /api/books/categories | All | List categories |

### Borrows
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/borrows | Librarian, Admin | All borrows |
| GET | /api/borrows/user/:id | All | User's borrows |
| POST | /api/borrows/issue | Librarian, Admin | Issue book |
| PUT | /api/borrows/:id/return | Librarian, Admin | Return book |
| PUT | /api/borrows/:id/renew | All | Renew book |

### Fines
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/fines | Librarian, Admin | All fines |
| GET | /api/fines/user/:id | All | User's fines |
| PUT | /api/fines/:id/pay | Librarian, Admin | Mark fine paid |

### Users
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/users | Librarian, Admin | All users |
| GET | /api/users/:id | All | Single user |
| PUT | /api/users/:id | All | Update user |
| DELETE | /api/users/:id | Admin | Delete user |

### Reports
| Method | URL | Access | Description |
|--------|-----|--------|-------------|
| GET | /api/reports/dashboard | All | Dashboard stats |
| GET | /api/reports/most-borrowed | Librarian, Admin | Top borrowed |
| GET | /api/reports/overdue | Librarian, Admin | Overdue list |
| GET | /api/reports/monthly | Librarian, Admin | Monthly data |

---

## Role Permissions

| Feature | Student | Librarian | Admin |
|---------|---------|-----------|-------|
| Browse books | Yes | Yes | Yes |
| My borrows | Yes | Yes | Yes |
| Reserve books | Yes | Yes | Yes |
| Issue / Return | No | Yes | Yes |
| Manage members | No | Yes | Yes |
| Add / Edit books | No | Yes | Yes |
| Delete books | No | No | Yes |
| View fines | No | Yes | Yes |
| Reports | No | No | Yes |
| Delete users | No | No | Yes |

---

