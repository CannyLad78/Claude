import { CardAdapter } from "../types";

export const weatherAdapter: CardAdapter = {
  type: "weather",
  label: "Weather (Open-Meteo)",
  description: "Current temperature and conditions for a location. No API key required.",
  fields: [
    { key: "latitude", label: "Latitude", type: "text", required: true, placeholder: "51.5074" },
    { key: "longitude", label: "Longitude", type: "text", required: true, placeholder: "-0.1278" },
  ],
  async fetchData(config) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", config.latitude);
    url.searchParams.set("longitude", config.longitude);
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,wind_speed_10m");

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Open-Meteo request failed (${res.status})`);
    const data = await res.json();
    const current = data.current ?? {};

    return {
      primary: { label: "Temperature", value: current.temperature_2m, unit: "°C" },
      items: [
        { label: "Humidity", value: current.relative_humidity_2m, unit: "%" },
        { label: "Wind", value: current.wind_speed_10m, unit: "km/h" },
      ],
      updatedAt: new Date().toISOString(),
    };
  },
};
