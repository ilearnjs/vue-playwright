# Finance Tracker Backend

Backend API for the Finance Tracker application built with Node.js, Fastify, and TypeScript.

## Features

- **Authentication**: JWT-based authentication with secure cookie storage
- **User Management**: User registration and profile management
- **Transaction Management**: CRUD operations for financial transactions
- **Dashboard Data**: Balance calculation and monthly summaries
- **Security**: Helmet, CORS, input validation, and rate limiting
- **High Performance**: Built with Fastify for superior performance
- **TypeScript**: Full type safety and modern development experience

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route handlers
├── middleware/      # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env` file

### Development

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Building for Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/balance` - Get user balance
- `GET /api/dashboard/monthly-data` - Get monthly income/expense data
- `GET /api/dashboard/transactions` - Get user transactions
- `POST /api/dashboard/transactions` - Create new transaction
- `PUT /api/dashboard/transactions/:id` - Update transaction
- `DELETE /api/dashboard/transactions/:id` - Delete transaction

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.example` for all available environment variables.

## Status

🚧 **Project Skeleton** - Implementation pending
- All endpoints are scaffolded but not yet implemented
- Database layer needs to be added
- Authentication logic needs implementation
- Business logic in services needs implementation

## Next Steps

1. Add database layer (PostgreSQL recommended)
2. Implement authentication logic
3. Implement business logic in services
4. Add input validation middleware
5. Add comprehensive error handling
6. Add logging
7. Add tests