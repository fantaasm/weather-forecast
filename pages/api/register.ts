import type { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/react";
import { hashPassword } from "../../services/passwordHelper";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, setDoc } from "@firebase/firestore";

type Data = {
  error?: string;
  message?: string;
};

const database = collection(db, "weather-forecast");

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const csrfTokenHeader = req.headers["x-csrf-token"];
  const csrfTokenCookie = await getCsrfToken({ req });

  // 0. No CSRF token in the request, sus.
  if (!csrfTokenHeader || !csrfTokenCookie) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  // 1. Validate CSRF token in the request.
  if (csrfTokenHeader !== csrfTokenCookie) {
    res.status(403).json({ error: "CSRF token mismatch" });
    return;
  }

  // 2. Check if user is already registered.
  const email = req.body.email;

  const q = query(database, where("email", "==", email));
  const dataQuerySnapshot = await getDocs(q);

  if (!dataQuerySnapshot.empty) {
    res.status(400).json({ error: "User with this email is already registered" });
    return;
  }

  // 3. Hash users password.
  const hashedPassword = await hashPassword(req.body.password);

  // 4. Register user.
  const uid =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  await setDoc(doc(database, uid), {
    email: email,
    password: hashedPassword,
    uid,
    activated: false,
  });

  // 5. If registration succeeded, return success message.
  res.status(200).json({ message: "Registration successful!" });
  return;
}
