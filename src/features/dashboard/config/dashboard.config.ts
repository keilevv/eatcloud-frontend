export const dashboardConfig = [
  {
    id: 'cancellation-analysis',
    title: 'Análisis de Cancelaciones',
    description: 'Datos procesados desde EatCloud API',
    widgets: [
      {
        itemSpacing: 4,  // gap between items within this row
        rowSpacing: 6,   // margin-bottom below this row
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
            subtitle: 'Kilogramos en el año 2026'
          },
          {
            id: 'kpi-3',
            type: 'kpi',
            title: 'Probabilidad de Cancelación',
            trend: true,
            textColor: 'text-red-500',
            subtitle: "(Total Canceladas / Total 2026)"
          },
          {
            id: 'kpi-4',
            type: 'kpi',
            title: 'Cantidad General',
          },
        ],
      },
      {
        itemSpacing: 4,  // gap between charts within this row
        rowSpacing: 0,   // no extra margin below (last row)
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
    ],
  },
];
