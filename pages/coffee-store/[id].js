import Link from 'next/link'
import { useRouter } from 'next/router'

const CoffeeStore = ({}) => {
  const router = useRouter()
  return (
    <div>
      Coffee Store {router.query.id}
      <Link href='/'>
        <a>Back to home</a>
      </Link>
      <Link href='/coffee-store/2'>
        <a>Back to home</a>
      </Link>
    </div>
  )
}

export default CoffeeStore
