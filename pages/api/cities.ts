import {NextApiRequest, NextApiResponse} from "next";
import cities1 from "../../public/cities1.json"
import cities2 from "../../public/cities2.json"
import cities3 from "../../public/cities3.json"
import cities4 from "../../public/cities4.json"
import {db} from "../../firebase";
import {collection, doc,  getDoc, setDoc} from "@firebase/firestore";
import {CityInfo} from "../../types/weather";

const cityCollection = collection(db,"cities");



export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {

  // console.log(cityCollection)

  const userId = req.body.userId || req.query.userId

  // 0. Check request params
  if (!userId) {
    return res.status(400).json({error: "Bad request, include userId"})
  }

  // 1. Check headers
  // if (!(req.headers && req.headers.authorization)) {
  //   return res.status(400).json({error: 'Missing Authorization header value'})
  // }

  // 2. Get auth token
  // const token = req.headers.authorization

  // 3. If not authed
  // if (token === 'unauthenticated') {
  //   return res.status(403).json({error: 'Not authorized'})
  // }

  // 4. Validate token
  // try {
  //   await verifyIdToken(token)
  // } catch (e) {
  //   console.log(e.message)
  //   return res.status(403).json({error: 'Not authorized'})
  // }

  // 5. Handle request
  if (req.method === "GET") {

    const document =  await getDoc(doc(cityCollection,userId))

    if (document) {
      try {
        const {cities} = document.data()
        const userCities = combinedCityList.map((cityId:number) => (allCities.find(c => c.id === cityId)))
        return res.status(200).json(userCities)
      } catch (e:any) {
        console.log(e.message)
      }
    }
  }

  if (req.method === "POST") {
    try {
      await setDoc(doc(cityCollection,userId), {cities: req.body.cities});
      return res.status(200).json({message: 'Success'})
    } catch (e:any) {
      console.log(e.message)
    }
  }

  return res.status(404).json({error: 'Not found'})
}

function getCombinedCities():CityInfo[] {
  return [...cities1,...cities2,...cities3,...cities4];
}