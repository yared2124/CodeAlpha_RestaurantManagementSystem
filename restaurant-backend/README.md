# Restaurant Backend (Monolith)

## Quick Start
1. `cp .env.example .env` and fill in credentials
2. `docker-compose up -d` (start PostgreSQL, Redis, RabbitMQ)
3. `npm install`
4. `npm run dev`

## API Endpoints
- `/auth` - register, login
- `/menu` - menu items and categories
- `/orders` - place and manage orders
- `/tables` - table availability and reservations
- `/inventory` - stock management (admin only)
- `/reports` - daily sales and stock alerts (admin only)
- `/admin` - dashboard and user management (admin only)

## Tech Stack
- Express.js
- PostgreSQL (Sequelize ORM)
- Redis (caching)
- RabbitMQ (async tasks)
- JWT authentication
- Winston logging
