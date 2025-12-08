import { tool } from "ai";
import z from "zod";

import * as chrono from "chrono-node";

type ForecastInput = {
  lat: number; // latitude
  lon: number; // longitude
  userMessage: string; // message like "weather in Italy this weekend"
};

// Uses coordinates from geocode { lat, lon } to fetch weather data.
export const forecast = tool({
  name: "forecast",
  description:
    "Receive a abject input containing the coordinates and the user message, then fetch weather forecast choosing the related dates given by the user message intentions",
  inputSchema: z.object({
    lat: z.number(),
    lon: z.number(),
    userMessage: z.string(),
  }),
  execute: async ({ lat, lon, userMessage }) => {
    // 1. Parse date range from user message using the chrono library
    const parsedDates = chrono.parse(userMessage);
    //console.log("parsed dates: ", parsedDates); // debug user message

    // Take first parsed date or range
    let startDate = parsedDates[0] ? parsedDates[0].start?.date() : new Date();
    let endDate = !parsedDates[0] || parsedDates[0].end === null ? startDate : parsedDates[0].end!.date();

    // if "Weekend" is in the message, the end date is increased by one
    // this because normally when "weekend" is found, only returns "Saturday" and not "Sunday" too
    if (/weekend/i.test(userMessage)) {
      const d = startDate.getDay();
      if (d === 6) {
        // Saturday
        const sunday = new Date(startDate);
        sunday.setDate(startDate.getDate() + 1);
        endDate = sunday;
      }
    }

    console.log("start: ", startDate); // debug start date
    console.log("end: ", endDate); // debug end date

    // Format as YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split("T")[0]; // "2025-12-06"

    // 2. Build dynamic Open-Meteo API URL
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&start_date=${formatDate(
      startDate,
    )}&end_date=${formatDate(endDate)}&timezone=auto`;

    // 3. Fetch data
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);

    // 4. Data returned from the API as a JSON type
    const data = await res.json();
    //console.log("data: ", data); // debug the data received
    return { weather: data };
  },
});
