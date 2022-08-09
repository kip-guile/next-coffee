import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner'
import Card from '../components/card'
import styles from '../styles/Home.module.css'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'
import { useEffect, useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from '../store/store-context'

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  }
}

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation()
  const [newCoffeeStoresError, setNewCoffeeStoresError] = useState(null)

  const { dispatch, state } = useContext(StoreContext)

  const { newCoffeeStores, latLong } = state

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const response = await fetch(
            `https://api.foursquare.com/v3/places/search?ll=${latLong}5&categories=13032&limit=30`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: process.env.NEXT_PUBLIC_FOURSQUARE,
              },
            }
          )

          const jsoncoffeeStores = await response.json()
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              jsoncoffeeStores,
            },
          })
          setNewCoffeeStoresError('')
        } catch (error) {
          console.log({ error })
          setNewCoffeeStoresError(error.message)
        }
      }
    }
    fetchData()
  }, [dispatch, latLong])

  const handleOnBannerClick = () => {
    handleTrackLocation()
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
          buttonText={isFindingLocation ? 'Locating...' : 'Visit stores nearby'}
          handleOnClick={handleOnBannerClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {newCoffeeStoresError && (
          <p>Something went wrong: {newCoffeeStoresError}</p>
        )}
        <div className={styles.heroImage}>
          <Image alt='hero' src='/static/hero.png' width={400} height={400} />
        </div>
        {newCoffeeStores?.results?.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {newCoffeeStores.results.map((coffeeStore) => {
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
          </div>
        )}

        {coffeeStores && coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
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
          </div>
        )}
      </main>
    </div>
  )
}
