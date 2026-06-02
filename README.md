# SituationalMap NP

Real-time incident tracking and resource management system for Nepal Police command operations.

## Quick Start

```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Add your DATABASE_URL to .env

# Setup database
bun run db:generate
bun run db:migrate
bun run db:seed

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Setup

Create `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

## Available Scripts

**Development**
```bash
bun dev              # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build
```

**Database**
```bash
bun run db:generate  # Generate Prisma Client
bun run db:migrate   # Run migrations
bun run db:seed      # Seed database
bun run db:studio    # Open Prisma Studio
bun run db:reset     # Reset database (⚠️ deletes all data)
```

**Code Quality**
```bash
bun run lint         # Lint code
bun run format       # Format code
```

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # React Query hooks
├── lib/
│   ├── services/   # Server functions
│   ├── schema/     # Zod validation
│   └── prisma.ts   # Database client
├── routes/         # TanStack Router
└── styles.css

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Seed data
```

## Tech Stack

- TanStack Start - Full-stack framework
- Prisma - Database ORM
- PostgreSQL - Database
- React Leaflet - Interactive maps
- Tailwind CSS - Styling
- TypeScript - Type safety

## Troubleshooting

**Database connection error**
```bash
bun run db:check
```

**Type errors**
```bash
bun run db:generate
```

**Port in use**
```bash
PORT=3001 bun dev
```
