import { tool } from "ai";
import z from "zod";

// Type for the full response from Open-Meteo geocoding API
type GeocodeApiResponse = {
  results: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    admin1: string;
    admin2: string;
  }[];
  generationtime_ms: number;
};

// Converts a location name into coordinates { lat, lon }
export const geocode = tool({
  name: "geocode",
  description: "Receive a abject input containing the location name as a string, and convert the location into coordinates (latitude, longitude).",
  inputSchema: z.object({ location: z.string().describe("The location to get the coordinates for") }),
  execute: async ({ location }) => {
    if (!location || location.length === 0) throw new Error("Location not found");

    console.log(`location: ${location} `);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Geocode API error: ${res.status}`);

    const data: GeocodeApiResponse = await res.json();

    if (!data.results || data.results.length === 0) throw new Error("Location not found");

    const { latitude, longitude } = data.results[0];
    return { lat: latitude, lon: longitude };
  },
});
