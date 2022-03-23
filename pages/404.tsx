import Layout from "../components/Layout";
import {useEffect, useState} from "react";
import {NextRouter, useRouter} from "next/router";

const title = "404 Not found"
const description = "Error page for open weather"

const ErrorPage = (): JSX.Element => {
  const [time, setTime] = useState<number>(5)
  const router: NextRouter = useRouter()

  useEffect(() => {
    if (time <= 0) {
      router.push("/");
      return;
    }
    setTimeout(() => {
      setTime((redirectSeconds) => redirectSeconds - 1);
    }, 1000)
  }, [time])

  return (
    <Layout title={title}
            description={description}>
      <h1>This page doesn&apos;t exist</h1>
    </Layout>
  )
}

export default ErrorPage