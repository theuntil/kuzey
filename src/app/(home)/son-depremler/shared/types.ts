export type EarthquakeItem = {
  id: string;
  title: string;
  mag: number;
  depthKm: number | null;
  timeISO: string;
  lat: number;
  lon: number;
};
