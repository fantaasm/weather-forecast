export type Coordinates = {
  lon: number;
  lat: number;
};

export interface CityInfo {
  id: number;
  name: string;
  country: string;
  state: string;
  coord: Coordinates;
}

export interface CityData {
  daily: Index[];
  hourly: Index[];
  minutely: Index[];
  current: any;
}

export interface CombinedCityData extends CityData, CityInfo {}

export type Temperature = {
  day: number;
  eve: number;
  max: number;
  min: number;
  morn: number;
  night: number;
};

export type WeatherDetails = {
  id: number;
  description: string;
  icon: string;
  main: string;
};

export type Index = {
  dt: number;
  humidity: number;
  temp: Temperature;
  weather: WeatherDetails[];
};
