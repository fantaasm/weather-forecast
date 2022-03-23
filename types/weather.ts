export type Coordinates = {
  lon: number
  lat: number
}

export type CityInfo = {
  id: number
  name: string
  country: string
  state: string
  coord: Coordinates
}

export type CityData = {
  daily: Weather[]
  hourly: Weather[]
  minutely: Weather[]
  current: any
}


export type Temperature = {
  day: number
  eve: number
  max: number
  min: number
  morn: number
  night: number
}

export type WeatherDetails = {
  id: number
  description: string
  icon: string
  main: string
}

export type Weather = {
  dt: number
  humidity: number
  temp: Temperature
  weather: WeatherDetails[]
}
