import Document, { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <Link
            rel='preload'
            href='/fonts/Nunito-Bold.ttf'
            as='font'
            crossOrigin='anonymous'
          >
            <a></a>
          </Link>
          <Link
            rel='preload'
            href='/fonts/Nunito-Regular.ttf'
            as='font'
            crossOrigin='anonymous'
          >
            <a></a>
          </Link>
          <Link
            rel='preload'
            href='/fonts/Nunito-Regular.ttf'
            as='font'
            crossOrigin='anonymous'
          >
            <a></a>
          </Link>
        </Head>
        <body>
          <Main></Main>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
