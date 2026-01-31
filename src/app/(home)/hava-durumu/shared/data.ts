import { unstable_cache } from "next/cache";

export type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
};

export type WeatherDaily = {
  date: string; // YYYY-MM-DD
  weathercode: number;
  tempMax: number;
  tempMin: number;
  precipProbMax: number | null;
  windMax: number | null;
};

export type WeatherPayload = {
  place: {
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  current: {
    temperature: number | null;
    windspeed: number | null;
    weathercode: number | null;
    time: string | null;
  };
  daily: WeatherDaily[]; // today + next 5 days (6 total)
};

type GeoResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone?: string;
  }>;
};

type ForecastResponse = {
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
  };
};

async function geocodeCity(name: string, country: string): Promise<GeoResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=5&language=tr&format=json`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = (await res.json()) as GeoResponse;
  const results = json.results ?? [];
  if (!results.length) return null;

  // country filtresi (en iyi eşleşme)
  const pick =
    results.find((r) => r.country?.toLowerCase() === country.toLowerCase()) ??
    results[0];

  return {
    name: pick.name,
    latitude: pick.latitude,
    longitude: pick.longitude,
    country: pick.country,
    admin1: pick.admin1,
    timezone: pick.timezone,
  };
}

async function fetchForecast(lat: number, lon: number): Promise<ForecastResponse | null> {
  // Open-Meteo forecast
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${encodeURIComponent(String(lat))}` +
    `&longitude=${encodeURIComponent(String(lon))}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
    `&forecast_days=6` +
    `&timezone=auto`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  return (await res.json()) as ForecastResponse;
}

function buildPayload(geo: GeoResult, fc: ForecastResponse): WeatherPayload | null {
  const tz = fc.timezone ?? geo.timezone ?? "auto";

  const daily = fc.daily;
  if (!daily?.time?.length) return null;

  const outDaily: WeatherDaily[] = daily.time.map((date, i) => ({
    date,
    weathercode: daily.weather_code?.[i] ?? 0,
    tempMax: daily.temperature_2m_max?.[i] ?? 0,
    tempMin: daily.temperature_2m_min?.[i] ?? 0,
    precipProbMax:
      typeof daily.precipitation_probability_max?.[i] === "number"
        ? daily.precipitation_probability_max![i]
        : null,
    windMax:
      typeof daily.wind_speed_10m_max?.[i] === "number"
        ? daily.wind_speed_10m_max![i]
        : null,
  }));

  return {
    place: {
      name: geo.name,
      country: geo.country,
      admin1: geo.admin1,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: tz,
    },
    current: {
      temperature: fc.current?.temperature_2m ?? null,
      windspeed: fc.current?.wind_speed_10m ?? null,
      weathercode: fc.current?.weather_code ?? null,
      time: fc.current?.time ?? null,
    },
    daily: outDaily,
  };
}

const getWeatherCached = unstable_cache(
  async (name: string, country: string): Promise<WeatherPayload | null> => {
    const geo = await geocodeCity(name, country);
    if (!geo) return null;

    const fc = await fetchForecast(geo.latitude, geo.longitude);
    if (!fc) return null;

    return buildPayload(geo, fc);
  },
  ["weather-payload-v1"],
  { revalidate: 60 * 10, tags: ["weather"] }
);

export async function getWeatherByCity(name: string, country: string) {
  return getWeatherCached(name, country);
}
