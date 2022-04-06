import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.query.lat || !req.query.lon) {
    return res.status(400).json({ error: "Wrong parameters" });
  }

  try {
    // @ts-ignore
    const urlSearchParams = new URLSearchParams({
      lat: req.query.lat,
      lon: req.query.lon,
      appid: process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY,
      units: "metric",
    });
    // console.log(urlSearchParams.toString());
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/onecall?" + urlSearchParams
    );

    if (!response.ok) {
      return res.status(500).json({ error: await response.json() });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: "Request failed" });
  }
}
