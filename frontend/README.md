# CookGenie Frontend

Next.js frontend for CookGenie application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard
│   ├── inventory/        # Inventory management
│   ├── recipes/          # Recipe generation & list
│   ├── favorites/        # Favorite recipes
│   ├── settings/         # User settings
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── inventory/        # Inventory-specific
│   └── recipe/           # Recipe-specific
├── lib/                  # Utilities
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

