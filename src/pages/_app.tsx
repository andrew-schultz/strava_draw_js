import { ActivitiesProvider } from "../providers/ActivitiesProvider";
import type { Metadata } from 'next'
import '../globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from "../providers/AuthProvider";
import TextGridProvider from "../providers/TextGridProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Strava Route PNG',
  description: 'Visualize Strava rides as PNGs',
}

export default function App({ Component, pageProps}) {
    return (
        <div className={inter.className}>
            <AuthProvider>
                <ActivitiesProvider>
                    <TextGridProvider>
                        <Component {...pageProps} />
                    </TextGridProvider>
                </ActivitiesProvider>
            </AuthProvider>
        </div>
    )
}