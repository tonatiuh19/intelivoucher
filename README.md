# InteliVoucher

A modern event ticketing application built with React, TypeScript, and Vite. This is a client-only application optimized for deployment on Vercel.

## Features

- 🎫 Browse and discover events
- 🛒 Interactive checkout process
- 📱 Responsive design for all devices
- 🎨 Modern UI with TailwindCSS and Radix UI components
- 📊 Admin dashboard for managing trips
- 👤 User dashboard for viewing purchases
- 💾 Local storage for data persistence

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS 3 + Radix UI components
- **Icons**: Lucide React
- **Routing**: React Router 6
- **State Management**: React Query + localStorage
- **Build Tool**: Vite
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd intelivoucher
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run format.fix` - Format code with Prettier

## Project Structure

```
client/
├── components/ui/     # Reusable UI components (Radix UI based)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and storage logic
├── pages/            # Route components and page layouts
├── types.ts          # TypeScript type definitions
├── App.tsx           # App entry point with routing
├── global.css        # Global styles and Tailwind imports
└── index.html        # HTML entry point

public/               # Static assets
dist/                 # Production build output
```

## Key Features

### Admin Dashboard (`/admin/trips`)

- Create, edit, and delete trips/events
- Manage trip details including pricing, images, and availability
- Toggle trip status and features

### User Dashboard (`/user/trips`)

- View purchase history
- Track reservation status
- Manage bookings

### Checkout Process (`/checkout`)

- Multi-step checkout flow
- Ticket selection and customization
- Customer information collection
- Payment simulation

## Data Storage

The application uses localStorage for data persistence:

- **Trips**: Stored in the `trips` key
- **Purchases**: Stored in the `purchases` key

## Deployment

This application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Vercel will automatically detect the build settings
3. The `vercel.json` configuration ensures proper SPA routing

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
