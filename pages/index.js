import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner'
import styles from '../styles/Home.module.css'

export default function Home() {
  const handleOnBannerClick = () => {
    console.log('click')
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='Discover coffee stores nearby' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText='Visit stores nearby'
          handleOnClick={handleOnBannerClick}
        />
        <div className={styles.heroImage}>
          <Image alt='hero' src='/static/hero.png' width={400} height={400} />
        </div>
      </main>
    </div>
  )
}
