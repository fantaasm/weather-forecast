import Document, {DocumentContext, Head, Html, Main, NextScript} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {...initialProps};
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"} />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet" />
        </Head>
        <body className="font-roboto bg-dark text-white antialiased">
        <Main />
        <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;