export const dashboardConfig = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Key performance indicators for your ecosystem.',
    widgets: [
      {
        id: 'kpi-1',
        type: 'kpi',
        title: 'Total Donations',
        value: 'Loading...',
      },
      {
        id: 'kpi-2',
        type: 'kpi',
        title: 'Active Beneficiaries',
        value: 'Loading...',
      },
      {
        id: 'kpi-3',
        type: 'kpi',
        title: 'Food Saved (kg)',
        value: 'Loading...',
      },
      {
        id: 'kpi-4',
        type: 'kpi',
        title: 'Carbon Offset (kg)',
        value: 'Loading...',
      },
    ],
  },
  {
    id: 'cancellation-analysis',
    title: 'Cancellation Analysis',
    description: 'Insights into donation cancellations and their reasons.',
    widgets: [
      { id: 'chart-1', type: 'chart', title: 'Cancellations Over Time' },
      { id: 'chart-2', type: 'chart', title: 'Cancellation Reasons' },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Ecosystem Map',
    description: 'Geographic distribution of donors and beneficiaries.',
    widgets: [{ id: 'map-1', type: 'map', title: 'Regional Distribution' }],
  },
];
