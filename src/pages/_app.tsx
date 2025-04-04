import { ActivitiesProvider } from "../providers/ActivitiesProvider";
import type { Metadata } from 'next'
import Head from "next/head";
import '../globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from "../providers/AuthProvider";
import TextGridProvider from "../providers/TextGridProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Route Viewer | Visualize your ride',
  description: 'Visualize Strava rides as PNGs',
}

export default function App({ Component, pageProps}) {
    return (
        <div className={inter.className}>
            <Head>
                <title>RouteViewer | Visualize your ride</title>
                <meta property="og:title" content="RouteViewer | Visualize your ride" key="title" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
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