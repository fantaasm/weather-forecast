import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";

type Data = {
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  // console.log(req.query)

  if (!req.query.lat || !req.query.lon) {
    return res.status(400).json({error: "Wrong parameters"});
  }

  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/onecall", {
      params: {
        lat: req.query.lat,
        lon: req.query.lon,
        appid: process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY,
        units: "metric"
      }
    })

    return res.status(200).json(response.data)
  } catch (error: any) {
    console.log(error.message)
    return res.status(400).json({error: "Request failed"})
  }
}