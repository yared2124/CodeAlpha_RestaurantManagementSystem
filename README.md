```markdown
# 🍽️ Restaurant Management System

A full‑stack admin panel for managing restaurant operations – orders, tables, inventory, reservations, and daily sales reporting. Built with React, Express.js, PostgreSQL, and Tailwind CSS.

## ✨ Features

### 👨‍💼 Admin Panel
- **Dashboard** – Real‑time metrics: orders today, revenue, low stock, available tables
- **Order Management** – Create, list, and update order status (pending → confirmed → preparing → ready → served → completed/cancelled)
- **Menu Management** – Add, edit, delete categories and menu items
- **Inventory Management** – Track stock levels, get low‑stock alerts, update quantities
- **Table & Reservation Management** – View tables, create/update reservations with availability checks
- **Daily Sales Reports** – Revenue breakdown by order type (dine‑in, takeaway, delivery)

### 🔐 Authentication
- JWT‑based authentication with role‑based access (admin / staff / customer)
- Secure login and session management

### 📦 Backend API
- RESTful API with Express.js
- PostgreSQL with Sequelize ORM
- Synchronous inventory deduction on order creation (no RabbitMQ required)
- Cron jobs for daily sales aggregation and stock alerts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Heroicons, React Router, Axios |
| **Backend** | Node.js, Express.js, JWT, Bcrypt, Winston (logging) |
| **Database** | PostgreSQL, Sequelize ORM |
| **Other** | node‑cron (scheduled jobs) |

---

##  Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yared2124/CodeAlpha_RestaurantManagementSystem.git
cd CodeAlpha_RestaurantManagementSystem
```

### 2️⃣ Backend Setup
```bash
cd restaurant-backend
cp .env.example .env   # Edit with your credentials
npm install
npm run dev
```

The backend will run at `http://localhost:3000`.

### 3️⃣ Frontend Setup
```bash
cd ../restaurant-frontend
cp .env.example .env   # Optional: adjust API URL
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 4️⃣ Database Setup
1. Create a PostgreSQL database (e.g., `restaurant_db`).
2. Update `.env` with your DB credentials.
3. The server will auto‑sync tables on startup.

### 5️⃣ Seed Sample Data (Optional)
```bash
cd restaurant-backend
./seed-data.sh   # (requires TOKEN environment variable set)
```

---

## 🔑 Default Admin Credentials
- **Email:** `admin@restaurant.com`
- **Password:** `admin123`

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`.

| Resource | Base Path | Key Endpoints |
|----------|-----------|---------------|
| Auth | `/auth` | `POST /register`, `POST /login` |
| Menu | `/menu` | `GET /items`, `POST /items`, `PUT /items/:id`, `DELETE /items/:id` |
| Orders | `/orders` | `POST /`, `GET /`, `PUT /:id/status` |
| Tables | `/tables` | `GET /`, `POST /`, `PUT /:id/status`, `POST /reservations` |
| Inventory | `/inventory` | `GET /`, `POST /`, `PUT /:id`, `POST /recipes` |
| Reports | `/reports` | `GET /daily-sales`, `GET /stock-alerts` |
| Admin | `/admin` | `GET /dashboard` |

---

## 📁 Project Structure

```
restaurant-backend/                # Backend (Express + PostgreSQL)
├── src/
│   ├── models/                    # Sequelize models
│   ├── services/                  # Business logic
│   ├── controllers/               # Route handlers
│   ├── routes/                    # API routes
│   ├── middleware/                # Auth, validation, error handling
│   └── utils/                     # Logger, cron, messaging
├── package.json
└── .env

restaurant-frontend/               # Frontend (React + Vite)
├── src/
│   ├── api/                       # Axios instance
│   ├── contexts/                  # Auth context
│   ├── routes/                    # Routing
│   └── components/                # All pages (Login, Dashboard, Orders, etc.)
├── index.html
├── package.json
└── tailwind.config.js
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vite](https://vitejs.dev/)

---

## 👤 Author

**Yared**  
GitHub: [@yared2124](https://github.com/yared2124)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!
```

---

## 🖼️ Recommended Screenshots

Create a `screenshots/` folder in your repository root and add:

- `login.png`
- `dashboard.png`
- `orders.png`
- `menu.png`
- `inventory.png`
- `reports.png`

---

## 🚀 How to Add This README

1. Copy the content above.
2. Save it as `README.md` in your repository root.
3. Commit and push:

```bash
git add README.md
git commit -m "Add comprehensive README"
git push origin main
