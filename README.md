# EatCloud Frontend

Aplicación web para la plataforma de analytics de donación de alimentos EatCloud. Construida con Next.js App Router y TypeScript, consume la API REST compartida utilizada por la aplicación móvil.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript (modo estricto)
- **Estilos:** Tailwind CSS v4
- **Componentes UI:** Shadcn/UI + Radix UI
- **Obtención de datos:** TanStack Query
- **Cliente HTTP:** Axios
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React
- **Temas:** next-themes
- **Fechas:** date-fns
- **Gestor de paquetes:** npm

## Estructura del Proyecto

```
src/
├── app/                 # Next.js App Router (layout, error, loading)
├── assets/              # Assets estáticos
├── components/
│   ├── ui/              # Componentes Shadcn UI
│   ├── common/          # UI compartida (ThemeToggle, etc.)
│   ├── layout/          # PageContainer, PageHeader, layouts
│   └── feedback/        # Estados de carga, error, vacío
├── config/              # Configuración de entorno
├── constants/           # Rutas, endpoints de API, tema, colores de gráficos
├── features/
│   ├── auth/            # Funcionalidad de autenticación
│   ├── dashboard/       # Funcionalidad de dashboard
│   ├── analytics/       # Funcionalidad de analytics
│   ├── maps/            # Funcionalidad de mapas
│   └── beneficiaries/   # Funcionalidad de beneficiarios
├── hooks/               # Hooks personalizados de React
├── layouts/             # Módulos de layout
├── lib/                 # Utilidades compartidas (cn)
├── providers/           # Proveedores de la app (Query, Theme, Toast)
├── schemas/             # Esquemas de validación Zod
├── services/
│   ├── api/             # Configuración del cliente Axios
│   └── repositories/    # Repositorios de API
├── styles/              # CSS global
├── types/               # Tipos compartidos de TypeScript
└── utils/               # Funciones de formato y ayuda
```

## Instalación

```bash
cd eatcloud-frontend
npm install
```

## Variables de Entorno

Copia la plantilla y configura tus valores:

```bash
cp .env.example .env.local
```

| Variable               | Descripción                           |
| ---------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL base de la API del backend        |
| `NEXT_PUBLIC_APP_NAME` | Nombre mostrado de la aplicación      |
| `NEXT_PUBLIC_ENV`      | Entorno (`development`, `production`) |

## Ejecución Local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts Disponibles

| Script                 | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Inicia servidor de desarrollo            |
| `npm run build`        | Crea build de producción                 |
| `npm start`            | Ejecuta servidor de producción           |
| `npm run lint`         | Ejecuta ESLint                           |
| `npm run lint:fix`     | Ejecuta ESLint con corrección automática |
| `npm run format`       | Formatea código con Prettier             |
| `npm run format:check` | Verifica formato                         |

## Despliegue en Vercel

El frontend incluye un `vercel.json` con Next.js como framework.

1. Sube el repositorio a GitHub e importa el directorio `eatcloud-frontend` en Vercel.
2. Vercel detecta Next.js automáticamente — no se necesita configuración adicional.
3. En el dashboard de Vercel, agrega las siguientes **Variables de Entorno**:

| Variable               | Valor                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL del backend desplegado (ej. `https://eatcloud-backend.vercel.app/api`) |
| `NEXT_PUBLIC_APP_NAME` | `EatCloud`                                                                 |
| `NEXT_PUBLIC_ENV`      | `production`                                                               |

4. Desplegar — cada push a la rama de producción dispara un nuevo build.

## Arquitectura

El frontend sigue una arquitectura basada en funcionalidades (features) diseñada para reutilización con la app móvil React Native:

```
pages → features → services/repositories → API
```

- **Pages** orquestan funcionalidades — sin lógica de negocio en componentes de página
- **Features** contienen componentes, hooks, tipos y servicios por dominio
- **Services** manejan la comunicación HTTP mediante el cliente Axios configurado
- **Types, constants y utils** son compartidos y genéricos
- **Providers** envuelven la app con React Query, tema y soporte de toasts

La lógica de negocio y transformación de datos viven fuera de los componentes UI, permitiendo patrones compartidos con el código base móvil.

## Flujo de Desarrollo

1. Crea una rama de funcionalidad desde `main`.
2. Implementa funcionalidades dentro de `src/features/<feature>/`.
3. Usa alias de ruta (`@/components`, `@/features`, etc.) — evita imports relativos profundos.
4. Ejecuta linting y formato antes de commitear:

   ```bash
   npm run lint:fix
   npm run format
   ```

## Arquitectura del Dashboard

El dashboard está construido usando un motor de composición basado en configuración.

### Shell de la Aplicación

- `DashboardLayout` proporciona el sidebar responsivo, encabezado y área de contenido principal.
- `DashboardSidebar` gestiona la navegación.
- `DashboardHeader` integra acciones globales como el menú de usuario.

### Sistema de Widgets

- El dashboard no usa JSX hardcodeado para métricas.
- `DashboardWidget` actúa como contenedor base proporcionando bordes, padding y estados de skeleton.
- Componentes reutilizables como `KpiCard`, `ChartCard` y `MapCard` aseguran una apariencia uniforme.
- `EmptyState` y `ErrorState` son estándar en todos los widgets.

### Sistema de Cuadrícula

- `ResponsiveGrid` gestiona automáticamente las columnas para escritorio, tablet y móvil sin requerir anchos fijos.

### Configuración del Dashboard

- Todo el layout del dashboard se gestiona mediante `config/dashboard.config.ts`.
- Próximas iteraciones solo necesitan actualizar este array de configuración para renderizar nuevos gráficos, KPIs o mapas dinámicamente.

## Arquitectura de Gráficos

El dashboard implementa una infraestructura de gráficos altamente reutilizable usando Victory, separada en capas:

1. **DTOs & Adapters**: `DonorChartAdapter`, `DonationPointAdapter`, etc. transforman respuestas crudas del backend en datasets estándar `ChartSeries` y `ChartPoint` sin mutar la lógica de negocio.
2. **Configuración & Utils**: Configuraciones de gráficos (`ChartConfig`), theming (`chartTheme.ts`, `victoryTheme.ts`) y formateadores (`formatAxis`, `formatTooltip`) dictan la estética y etiquetas de forma uniforme.
3. **Wrappers Genéricos**: `VictoryBarWrapper`, `VictoryScatterWrapper` y `VictoryChartWrapper` manejan todas las configuraciones propietarias de Victory de forma segura.
4. **Componentes de Presentación**: `BarChart`, `HorizontalBarChart`, `ScatterChart` y `ChartContainer` ensamblan los layouts junto con estados de carga, vacío y error.

Esto asegura que la lógica UI está completamente abstraída, proporcionando una reutilización profunda de código — ideal para portar configuraciones y formateadores a la futura app React Native.

### Estructura de Carpetas de Gráficos

```text
src/features/dashboard/charts/
├── adapters/      # Transformadores de datos (DTO -> ChartSeries)
├── components/    # Componentes de gráficos reutilizables y estados
├── config/        # Márgenes, tipografía, tokens de tema
├── hooks/         # Utilidades de layout responsivo
├── styles/        # Definiciones de tema de Victory
├── types/         # Interfaces principales
├── utils/         # Formateo de ejes, tooltips y ordenamiento
└── wrappers/      # Capa de abstracción base de Victory
```

## Licencia

Privado
