export const dashboardConfig = [
  {
    id: 'cancellation-analysis',
    title: 'Análisis de Cancelaciones',
    description: 'Key performance indicators for your ecosystem.',
    widgets: [
      {
        id: 'kpi-1',
        type: 'kpi',
        title: 'Cantidad Donaciones Canceladas',
        value: 'Loading...',
      },
      {
        id: 'kpi-2',
        type: 'kpi',
        title: 'Total Kg Cancelados',
        value: 'Loading...',
      },
      {
        id: 'kpi-3',
        type: 'kpi',
        title: 'Probabilidad de Cancelación',
        value: 'Loading...',
      },
      {
        id: 'kpi-4',
        type: 'kpi',
        title: 'Cantidad General',
        value: 'Loading...',
      },
      {
        id: 'chart-1',
        type: 'bar',
        title: 'Donantes: Cantidad vs Total KG',
        value: 'Loading...',
        className: 'col',
      },
      {
        id: 'chart-2',
        type: 'horizontalBar',
        title: 'Donantes: Cantidad vs Total KG',
        value: 'Loading...',
        className: 'col',
      },
    ],
  },
  // {
  //   id: 'donor-analysis',
  //   title: 'Donor Analysis',
  //   description: 'Insights into donors and donation points.',
  //   widgets: [
  //     { id: 'chart-1', type: 'bar', title: 'Donantes: Cantidad vs Total KG', config: { yAxisFormat: 'kilograms', tooltipFormat: 'kilograms' } },
  //     { id: 'chart-2', type: 'horizontalBar', title: 'Top 10 Donation Points', config: { yAxisFormat: 'thousands', tooltipFormat: 'thousands' } },
  //   ],
  // },
  // {
  //   id: 'risk-analysis',
  //   title: 'Risk Analysis',
  //   description: 'Insights into donor and donation point risks.',
  //   widgets: [
  //     { id: 'chart-3', type: 'horizontalBar', title: 'Top 10 Risk Donors', config: { yAxisFormat: 'percentage', tooltipFormat: 'percentage' } },
  //     { id: 'chart-4', type: 'bar', title: 'Top 15 Risk Donation Points', config: { yAxisFormat: 'percentage', tooltipFormat: 'percentage' } },
  //     { id: 'chart-5', type: 'scatter', title: 'Scatter Plot', subtitle: 'Announcements Volume vs Historical Cancellation Probability', config: { yAxisFormat: 'percentage', xAxisFormat: 'thousands', tooltipFormat: 'percentage' } },
  //   ],
  // },
  // {
  //   id: 'ecosystem',
  //   title: 'Ecosystem Map',
  //   description: 'Geographic distribution of donors and beneficiaries.',
  //   widgets: [{ id: 'map-1', type: 'map', title: 'Regional Distribution' }],
  // },
];
