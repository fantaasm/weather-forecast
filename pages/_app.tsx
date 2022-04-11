import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const url = process.env.NEXT_PUBLIC_DOMAIN_NAME + router.route;

  return (
    <>
      <Head>
        <link rel="icon" type="image/webp" href="/weather-forecast/favicon.webp" />
      </Head>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_US",
          url,
          site_name: "Weather Forecast | fantasea.pl",
        }}
        canonical={url}
      />

      <SessionProvider session={session} basePath={"/weather-forecast/api/auth"}>
        <ThemeProvider defaultTheme="system" attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
