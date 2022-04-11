import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../firebase";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import { getCsrfToken, getSession } from "next-auth/react";
import { CityInfo } from "../../types";
import { Session } from "next-auth";

const pako = require("pako");
const cityCollection = collection(db, "weather-forecast");

export type Document = {
  uid: string;
  name: string;
  email: string;
  cities: number[];
  password?: string;
};

let cityList: CityInfo[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 0 Load cities on first request
  if (!cityList) {
    await fetch(
      "https://github.com/fantaasm/open-weather/blob/dev/public/cities.json.gz?raw=true",
      {
        headers: {
          "Accept-Encoding": "gzip",
          "responseType": "arraybuffer",
        },
      }
    )
      .then((res) => res.arrayBuffer())
      .then((res) => pako.ungzip(res, { to: "string" }))
      .then((res) => (cityList = JSON.parse(res)));
  }

  // 1. Check sub (UID) headers
  const uid = req.headers.authorization;
  console.log("uid", uid);
  if (!uid) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // 2. Validate CSRF token and JWT Session
  const sessionPromise: Promise<Session | null> = getSession({ req });
  const csrfTokenPromise = getCsrfToken({ req });
  const [session, csrfToken] = await Promise.all([sessionPromise, csrfTokenPromise]);

  if (!session || !csrfToken) {
    return res.status(403).json({ error: "Not authorized" });
  }
  console.log("Authed api call ", req.method);
  console.log("Authed api call ", req.body);

  // 5. Handle request
  if (req.method === "GET") {
    const document = await getDoc(doc(cityCollection, uid));
    if (document) {
      try {
        const { cities } = document.data() as Document;
        const userCities = cities.map((cityId: number) => cityList.find((c) => c.id === cityId));
        return res.status(200).json(userCities);
      } catch (e: any) {
        console.log(e.message);
      }
    }
  }

  if (req.method === "POST") {
    console.log("updating cities for user", uid);
    const { cities } = JSON.parse(req.body);
    console.log("Updating cities", cities);
    try {
      await setDoc(
        doc(cityCollection, uid),
        {
          username: session.user.name,
          email: session.user.email,
          cities,
        },
        { merge: true }
      );
      return res.status(200).json({ message: "Success" });
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return res.status(404).json({ error: "Not found" });
}
