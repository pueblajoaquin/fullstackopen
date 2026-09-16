const codes = {
  0:  { label: 'Clear sky',              icon: '01' },
  1:  { label: 'Mainly clear',           icon: '02' },
  2:  { label: 'Partly cloudy',          icon: '03' },
  3:  { label: 'Overcast',               icon: '04' },
  45: { label: 'Fog',                    icon: '50' },
  48: { label: 'Depositing rime fog',    icon: '50' },
  51: { label: 'Light drizzle',          icon: '09' },
  53: { label: 'Moderate drizzle',       icon: '09' },
  55: { label: 'Dense drizzle',          icon: '09' },
  56: { label: 'Light freezing drizzle', icon: '09' },
  57: { label: 'Dense freezing drizzle', icon: '09' },
  61: { label: 'Slight rain',            icon: '10' },
  63: { label: 'Moderate rain',          icon: '10' },
  65: { label: 'Heavy rain',             icon: '10' },
  66: { label: 'Light freezing rain',    icon: '13' },
  67: { label: 'Heavy freezing rain',    icon: '13' },
  71: { label: 'Slight snowfall',        icon: '13' },
  73: { label: 'Moderate snowfall',      icon: '13' },
  75: { label: 'Heavy snowfall',         icon: '13' },
  77: { label: 'Snow grains',            icon: '13' },
  80: { label: 'Slight rain showers',    icon: '09' },
  81: { label: 'Moderate rain showers',  icon: '09' },
  82: { label: 'Violent rain showers',   icon: '09' },
  85: { label: 'Slight snow showers',    icon: '13' },
  86: { label: 'Heavy snow showers',     icon: '13' },
  95: { label: 'Thunderstorm',           icon: '11' },
  96: { label: 'Thunderstorm with slight hail', icon: '11' },
  99: { label: 'Thunderstorm with heavy hail',  icon: '11' }
}

const describeWeather = (code, isDay = 1) => {
  const api_key = import.meta.env.VITE_OPEN_WEATHER_MAP_IMGS
  const weather = codes[code] ?? { label: 'Unknown', icon: '50' }
  const isDayString = isDay ? 'd' : 'n'
  return {
    label: weather.label,
    iconUrl: `${api_key}${weather.icon}${isDayString}@2x.png`
  }
}

export default describeWeather  