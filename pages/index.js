import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner'
import Card from '../components/card'
import styles from '../styles/Home.module.css'
import coffeeStoresData from '../data/coffee-stores.json'

export async function getStaticProps(context) {
  return {
    props: {
      coffeeStores: coffeeStoresData,
    }, // will be passed to the page component as props
  }
}

export default function Home({ coffeeStores }) {
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

        <div className={styles.sectionWrapper}>
          {coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={
                        coffeeStore.imgUrl ||
                        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                      }
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
