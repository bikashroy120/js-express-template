# JS Express Template

A production-ready Node.js Express.js API template with ESLint, Prettier, error handling, and security best practices.

## Project Structure

```
src/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── config.js           # Environment configuration
├── app/
│   └── middlewares/
│       └── globalErrorHandler.js  # Global error handling
├── errors/
│   └── ApiError.js     # Custom API error class
└── shared/
    └── sendResponse.js # Response utility
```

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment configuration:**
   - Copy `.env.example` to `.env`
   - Update values as needed

## Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm run lint` - Check code style with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Configuration

### ESLint

- Modern flat config (eslint.config.js)
- Prettier integration
- Node.js environment with recommended rules
- Custom rules for production safety

### Prettier

- 2-space indentation
- Single quotes
- Semicolons enabled
- 80-character line width
- LF line endings

### Environment Variables

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 5000)
- `ALLOWED_ORIGINS` - CORS-allowed origins (comma-separated)

## Features

✅ Express.js with production middleware
✅ Helmet for security headers
✅ CORS with configurable origins
✅ Rate limiting per environment
✅ Compression middleware
✅ HPP (HTTP Parameter Pollution protection)
✅ Error handling utilities
✅ Response formatting utility
✅ ESLint + Prettier integration
✅ Environment configuration
✅ Nodemon for development
✅ Unhandled exception handling

## Development

Start the development server:

```bash
npm run dev
```

The server will auto-reload on file changes and listen on `http://localhost:5000`

## Production

Build and run for production:

```bash
NODE_ENV=production npm start
```

## Code Quality

Ensure code quality before committing:

```bash
npm run lint      # Check for issues
npm run format    # Format code
npm run lint:fix  # Fix issues automatically
```

## License

ISC
