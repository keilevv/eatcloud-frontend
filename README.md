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

## Authentication Architecture

The authentication module is designed to be scalable and handles JWT-based authentication.

### Authentication Flow
1. User submits credentials on `/login`.
2. `LoginForm` uses React Hook Form and Zod to validate input.
3. `useLogin` hook triggers the Axios client to call the backend.
4. On success, the JWT token is stored securely via `auth.storage.ts`.
5. `AuthContext` updates with user details and authentication status.
6. User is redirected to the protected dashboard.

### Session Restoration
When the application starts or refreshes:
1. `SessionProvider` checks for an existing JWT token in `auth.storage.ts`.
2. If found, a request is made to `/api/auth/me` to fetch user details.
3. During this process, a `SessionLoading` state is displayed to keep the application responsive.
4. If the token is invalid or expired, the session is cleared automatically.

### Protected Routes
- `AuthGuard` is a component that wraps protected content. It checks the `isAuthenticated` state from the session. If the user is unauthenticated, they are redirected to `/login`.
- `ProtectedLayout` implements the standard authenticated dashboard layout.

### Axios Interceptors
All authenticated requests automatically include the `Authorization` header via Axios request interceptors. Response interceptors handle `401 Unauthorized` and `403 Forbidden` errors by clearing invalid sessions and dispatching a custom event (`auth:unauthorized`) to redirect users to `/login`.

## License

Private
