import "../styles/globals.css";
import {SessionProvider} from "next-auth/react";
import Head from "next/head";
import {DefaultSeo} from "next-seo";
import {AppProps} from "next/app";



function MyApp({Component, pageProps: {session, ...pageProps},router}:AppProps) {
  const url = process.env.NEXT_PUBLIC_DOMAIN_NAME + router.route


  console.log(pageProps)
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <DefaultSeo
        titleTemplate="%s - Open Weather"
        openGraph={{
          type: 'website',
          locale: 'en_IE',
          url,
          description: 'Get your daily weather',
          site_name: `Open Weather | ${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
          images: [],
        }}
        canonical={url}
      />

      <SessionProvider session={session}>
        <Component {...pageProps}  />
      </SessionProvider>
  </>
  );
}

export default MyApp