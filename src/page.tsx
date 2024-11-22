import type { Metadata } from 'next'
import HomePage from './pages/index'

export const metadata: Metadata = {
  title: 'Strava Route PNG',
  description: 'Visualize Strava rides as PNGs',
}

export default async function Home() {
  return (
    <main className="">
      <HomePage />
    </main>
  )
}
