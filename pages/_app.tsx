import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router,
}: AppProps) {
  const url = process.env.NEXT_PUBLIC_DOMAIN_NAME + router.route;

  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/webp"
          href="/weather-forecast/favicon.webp"
        />
      </Head>
      <DefaultSeo
        defaultTitle="Weather Forecast"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url,
          description: "Get your daily weather forecast",
          site_name: "Weather Forecast | fantasea.pl",
          images: [],
        }}
        canonical={url}
      />

      <SessionProvider
        session={session}
        basePath={"/weather-forecast/api/auth"}
      >
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
