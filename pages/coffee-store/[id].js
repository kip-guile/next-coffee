import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

import useSWR from 'swr'
import cls from 'classnames'

import styles from '../../styles/coffee-store.module.css'
import { fetchCoffeeStores } from '../../lib/coffee-stores'
import { StoreContext } from '../../store/store-context'
import { fetcher, isEmpty } from '../../utils'

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores()
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id //dynamic id
  })
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    }, // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = (props) => {
  const router = useRouter()
  const id = router.query.id

  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {})

  const {
    state: { newCoffeeStores },
  } = useContext(StoreContext)

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: coffeeStore.id,
          name: coffeeStore.name,
          voting: 0,
          imgUrl:
            coffeeStore.imgUrl ||
            'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
          neigbourhood: coffeeStore.neighbourhood
            ? coffeeStore.neighbourhood[0]
            : '',
          address: coffeeStore.address ? coffeeStore.address : '',
        }),
      })

      const dbCoffeeStore = await response.json()
    } catch (err) {
      console.error('Error creating coffee store', err)
    }
  }

  useEffect(() => {
    if (isEmpty(props.coffeeStore)) {
      if (newCoffeeStores && newCoffeeStores.resolved) {
        if (newCoffeeStores.resolved.length > 0) {
          const findCoffeeStoreById = newCoffeeStores.resolved.find(
            (coffeeStore) => {
              return coffeeStore.id.toString() === id //dynamic id
            }
          )
          setCoffeeStore(findCoffeeStoreById)
          handleCreateCoffeeStore(findCoffeeStoreById)
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(props.coffeeStore)
    }
  }, [id, props.coffeeStore, newCoffeeStores])

  const {
    name = '',
    address = '',
    neighbourhood = '',
    imgUrl = '',
  } = coffeeStore
  const [votingCount, setVotingCount] = useState(0)

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0])
      setVotingCount(data[0].voting)
    }
  }, [data])

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favoriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      })

      const dbCoffeeStore = await response.json()

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1
        setVotingCount(count)
      }
    } catch (err) {
      console.error('Error upvoting the coffee store', err)
    }
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name='description' content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width='24'
                height='24'
                alt='places icon'
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width='24'
                height='24'
                alt='near me icon'
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width='24'
              height='24'
              alt='star icon'
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
