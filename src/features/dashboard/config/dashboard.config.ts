export const dashboardConfig = [
  {
    id: 'cancellation-analysis',
    title: 'Análisis de Cancelaciones',
    description: 'Datos procesados desde EatCloud API',
    widgets: [
      {
        itemSpacing: 4, // gap between items within this row
        rowSpacing: 6, // margin-bottom below this row
        items: [
          {
            id: 'kpi-1',
            type: 'kpi',
            title: 'Cantidad Donaciones Canceladas',
          },
          {
            id: 'kpi-2',
            type: 'kpi',
            title: 'Total Kg Cancelados',
            subtitle: 'Kilogramos en el año 2026',
          },
          {
            id: 'kpi-3',
            type: 'kpi',
            title: 'Probabilidad de Cancelación',
            trend: true,
            textColor: 'text-red-500',
            subtitle: '(Total Canceladas / Total 2026)',
          },
          {
            id: 'kpi-4',
            type: 'kpi',
            title: 'Cantidad General',
          },
        ],
      },
      {
        itemSpacing: 4, // gap between charts within this row
        rowSpacing: 6, // no extra margin below (last row)
        items: [
          {
            id: 'chart-1',
            type: 'bar',
            title: 'Donantes: Cantidad vs Total KG',
          },
          {
            id: 'chart-2',
            type: 'bar',
            title: 'Top 10 Puntos de Donación (Anuncios)',
          },
        ],
      },
      {
        itemSpacing: 4, // gap between items within this row
        rowSpacing: 6, // no extra margin below (last row)
        items: [
          {
            id: 'heatmap1',
            type: 'heatMap',
            title: 'Calor por Cantidad (Veces)',
            mode: 'quantity',
          },
          {
            id: 'heatmap2',
            type: 'heatMap',
            title: 'Calor por Volumen (KG)',
            mode: 'totalKg',
          },
        ],
      },
      {
        itemSpacing: 4,
        rowSpacing: 0,
        items: [
          {
            id: 'cluster-map1',
            type: 'clusterMap',
            title: 'Mapa de Puntos de Donación (Cantidad)',
            mode: 'quantity',
          },
          {
            id: 'cluster-map2',
            type: 'clusterMap',
            title: 'Mapa de Puntos de Donación (Volumen KG)',
            mode: 'totalKg',
          },
        ],
      },
    ],
  },
  {
    id: 'predictive-analysis',
    title: 'Análisis Predictivo de Riesgo',
    description:
      'Probabilidad histórica de cancelación por Punto y por Donante',
    widgets: [
      {
        itemSpacing: 4,
        rowSpacing: 6,
        items: [
          {
            id: 'kpi-5',
            type: 'kpi',
            title: 'Punto de Mayor Riesgo',
            subtitle: '100.00% Probabilidad (all)',
            textColor: 'text-red-500',
          },
          {
            id: 'kpi-6',
            type: 'kpi',
            title: 'Donante de Mayor Riesgo',
            subtitle: '100.00% Probabilidad',
            textColor: 'text-amber-500',
          },
          {
            id: 'kpi-7',
            type: 'kpi',
            title: 'Puntos Excelentes (0% Riesgo)',
            subtitle: 'Con el volumen exigido y 0 cancelaciones',
            textColor: 'text-green-500',
          },
        ],
      },
      {
        itemSpacing: 4,
        rowSpacing: 6,
        items: [
          {
            id: 'chart-3',
            type: 'horizontalBar',
            title: 'Top 10 Donantes con Mayor Riesgo',
          },
          {
            id: 'chart-4',
            type: 'bar',
            title: 'Top 15 Puntos con Mayor Riesgo',
          },
        ],
      },
      {
        itemSpacing: 4,
        rowSpacing: 6,
        items: [
          {
            id: 'scatter-1',
            type: 'scatter',
            title: 'Dispersión: Volumen de Anuncios vs Probabilidad',
          },
        ],
      },
    ],
  },
  {
    id: 'beneficiaries',
    title: 'Visualización de Beneficiarios por Tipología y Estado Operativo',
    description:
      'Cruza la ubicación de los beneficiarios según su tipología y estado operativo frente a las zonas de riesgo.',
    widgets: [
      {
        itemSpacing: 4,
        rowSpacing: 6,
        items: [
          {
            id: 'filter-1',
            type: 'filter',
            title: 'Filtro por Tipología:',
            subtitle: 'Seleccione el filtro para ver los beneficiarios',
            textColor: 'text-blue-500',
          },
          {
            id: 'filter-2',
            type: 'filter',
            title: 'Filtro por Estado Operativo',
            subtitle: 'Seleccione el filtro para ver los beneficiarios',
            textColor: 'text-blue-500',
          },
        ],
      },
      {
        itemSpacing: 4,
        rowSpacing: 6,
        items: [
          {
            id: 'beneficiaries-map',
            type: 'semaphoreMap',
            title: 'Mapa de Beneficiarios',
            subtitle:
              '🟢 0-5% | 🟡 6-15% | 🔴 >15% (Riesgo Sucursales) | Capas de Beneficiarios Activables - 🔵 T1 (Bancos) 🟣 T2 (Fundaciones) 🟠 T3 (Otros)',
            textColor: 'text-blue-500',
          },
        ],
      },
    ],
  },
];
