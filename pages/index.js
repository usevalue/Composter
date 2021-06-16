import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Composter</title>
        <link rel="icon" href="/images/stockseed.ico" />
      </Head>

      <main className={styles.main}>
        <h2>Welcome to the Composter</h2>
        <Link href="map"><a>Go see the map.</a></Link>
      </main>
    </div>
  )
}
