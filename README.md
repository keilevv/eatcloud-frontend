# EatCloud Frontend

Web application for the EatCloud food donation analytics platform. Built with Next.js App Router and TypeScript, consuming the shared REST API used by the mobile application.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI + Radix UI
- **Data Fetching:** TanStack Query
- **HTTP Client:** Axios
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Theming:** next-themes
- **Dates:** date-fns
- **Package Manager:** pnpm

## Folder Structure

```
src/
├── app/                 # Next.js App Router (layout, error, loading)
├── assets/              # Static assets
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── common/          # Shared UI (ThemeToggle, etc.)
│   ├── layout/          # PageContainer, PageHeader, layouts
│   └── feedback/        # Loading, error, empty states
├── config/              # Environment configuration
├── constants/           # Routes, API endpoints, theme, chart colors
├── features/
│   ├── auth/            # Authentication feature (future)
│   ├── dashboard/       # Dashboard feature (future)
│   ├── analytics/       # Analytics feature (future)
│   ├── maps/            # Maps feature (future)
│   └── beneficiaries/   # Beneficiaries feature (future)
├── hooks/               # Custom React hooks
├── layouts/             # Layout modules
├── lib/                 # Shared utilities (cn)
├── providers/           # App providers (Query, Theme, Toast)
├── schemas/             # Zod validation schemas
├── services/
│   ├── api/             # Axios client configuration
│   └── repositories/    # API repositories (future)
├── styles/              # Global CSS
├── types/               # Shared TypeScript types
└── utils/               # Formatting and helper functions
```

## Installation

```bash
cd eatcloud-frontend
pnpm install
```

## Environment Variables

Copy the template and configure your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| -------- | ----------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | Application display name |
| `NEXT_PUBLIC_ENV` | Environment (`development`, `production`) |

## Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint with auto-fix |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |

## Architecture

The frontend follows a feature-based architecture designed for reuse with the React Native mobile app:

```
pages → features → services/repositories → API
```

- **Pages** orchestrate features — no business logic in page components
- **Features** contain components, hooks, types, and services per domain
- **Services** handle HTTP communication via the configured Axios client
- **Types, constants, and utils** are shared and generic
- **Providers** wrap the app with React Query, theme, and toast support

Business logic and data transformation live outside UI components, enabling shared patterns with the mobile codebase.

## Development Workflow

1. Create a feature branch from `main`.
2. Implement features inside `src/features/<feature>/`.
3. Use path aliases (`@/components`, `@/features`, etc.) — avoid deep relative imports.
4. Run linting and formatting before committing:

   ```bash
   pnpm lint:fix
   pnpm format
   ```

5. Husky runs ESLint and Prettier on staged files via lint-staged during pre-commit.

## Future Modules

The following modules will be implemented in upcoming prompts:

- Authentication (login, JWT, protected routes) - **Implemented**
- Dashboard layout and navigation
- Analytics charts and KPI cards
- Interactive maps
- Beneficiary management views
- API integration with TanStack Query hooks

## Dashboard Architecture

The dashboard is built using a configuration-driven composition engine.

### Application Shell
- `DashboardLayout` provides the responsive sidebar, header, and main content area.
- `DashboardSidebar` manages navigation.
- `DashboardHeader` integrates global actions like the user menu.

### Widget System
- The dashboard does not use hardcoded JSX for metrics.
- `DashboardWidget` acts as the base container providing borders, padding, and skeleton states.
- Reusable components like `KpiCard`, `ChartCard`, and `MapCard` ensure uniform appearance.
- `EmptyState` and `ErrorState` are standard across all widgets.

### Grid System
- `ResponsiveGrid` automatically manages columns for desktop, tablet, and mobile displays without requiring fixed widths.

### Dashboard Configuration
- The entire dashboard layout is managed via `config/dashboard.config.ts`.
- Future prompts only need to update this configuration array to render new charts, KPIs, or maps dynamically.

## License

Private
