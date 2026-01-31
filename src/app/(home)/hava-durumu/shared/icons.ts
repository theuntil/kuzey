// WMO Weather Codes (Open-Meteo) -> ikon eşleme (senin public/weather dosyalarına göre)

export function iconForWeatherCode(code: number, isNight?: boolean) {
  const night = Boolean(isNight);

  // Clear
  if (code === 0) return night ? "/weather/clear-night.apng" : "/weather/clear-day.apng";

  // Mainly clear / partly cloudy / overcast
  // (senin sette "partly-cloudy" yok; en yakın: cloudy-day/night)
  if ([1, 2].includes(code)) return night ? "/weather/cloudy-night.apng" : "/weather/cloudy-day.apng";

  // Overcast
  if (code === 3) return night ? "/weather/cloudy-night.apng" : "/weather/cloudy-day.apng";

  // Fog
  if ([45, 48].includes(code)) return "/weather/fog.apng";

  // Drizzle / freezing drizzle
  // (drizzle ikonun yok; rain-day/night kullan)
  if ([51, 53, 55, 56, 57].includes(code))
    return night ? "/weather/rain-night.apng" : "/weather/rain-day.apng";

  // Rain / freezing rain
  if ([61, 63, 65, 66, 67].includes(code))
    return night ? "/weather/rain-night.apng" : "/weather/rain-day.apng";

  // Snow / snow grains
  if ([71, 73, 75, 77].includes(code)) return "/weather/snow.apng";

  // Rain showers
  if ([80, 81, 82].includes(code))
    return night ? "/weather/rain-night.apng" : "/weather/rain-day.apng";

  // Thunderstorm (+ hail)
  if ([95, 96, 99].includes(code)) return "/weather/storm.apng";

  // Fallback
  return night ? "/weather/cloudy-night.apng" : "/weather/cloudy-day.apng";
}

export function labelForWeatherCodeTR(code: number) {
  if (code === 0) return "Açık";
  if ([1, 2].includes(code)) return "Parçalı bulutlu";
  if (code === 3) return "Bulutlu";
  if ([45, 48].includes(code)) return "Sisli";
  if ([51, 53, 55, 56, 57].includes(code)) return "Çiseleme";
  if ([61, 63, 65, 66, 67].includes(code)) return "Yağmurlu";
  if ([71, 73, 75, 77].includes(code)) return "Karlı";
  if ([80, 81, 82].includes(code)) return "Sağanak";
  if ([95, 96, 99].includes(code)) return "Gök gürültülü";
  return "Bilinmiyor";
}
