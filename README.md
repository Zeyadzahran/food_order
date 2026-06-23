# Bold Bites - Food Ordering Application

A brutalist, high-energy food ordering application built with the MERN stack. Designed with a distinct visual identity using full-width borders, sharp shadows, and high contrast typography.

## Features

- **Brutalist UI/UX:** Sharp corners, high contrast (`#6d28d9`), and heavy drop shadows (`shadow-[8px_8px_0px_#000]`).
- **Full i18n & RTL Support:** Fully localized in English and Arabic. RTL layout dynamically switches on language toggle.
- **State Management:** Zustand used for Cart & Authentication. Persisted in localStorage.
- **Authentication:** JWT-based user login & registration.
- **Admin Dashboard:** Manage products, categories, modify order status.
- **Order Tracking:** Live polling simulating order updates based on status shifts.
- **Robust Routing:** React Router v6 complete with Protected and Admin-specific routes.

## Tech Stack

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS (v3) + `tailwind-merge` + `clsx`
- Zustand (State)
- React Router v6
- React-i18next (Localization)
- Axios (API Client)
- Lucide React (Icons)

**Backend:**
- Node.js, Express
- MongoDB + Mongoose
- JSON Web Tokens (Authentication)
- Swagger / OpenAPI 3.0 (API Documentation)
- Seed Scripts for easy initialization.

## Environment Variables

### Backend (`/backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/food_order  # or your Atlas URI
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`/frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

## Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Environments**
   Add `.env` files in both directories following the template above.

3. **Seed Database**
   ```bash
   cd backend
   npm run seed
   # This will create an Admin user (admin@example.com / admin123)
   # and populate categories and menu items.
   ```

4. **Run Application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Development Notes

- **Typography:** The app relies on "Syne" for heavy headings and "Inter" for body. Google Fonts are imported in `index.css`.
- **RTL Overrides:** Tailwind `rtl:` modifiers are heavily used. For custom interactions, `.rtl-flip` handles horizontal spacing mirroring.

