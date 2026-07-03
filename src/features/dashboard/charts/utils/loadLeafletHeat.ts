let heatPluginPromise: Promise<void> | null = null;

export function loadLeafletHeat(): Promise<void> {
  if (!heatPluginPromise) {
    heatPluginPromise = import('leaflet.heat').then(() => undefined);
  }
  return heatPluginPromise;
}
