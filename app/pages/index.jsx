'use client'
import HomeMain from '../components/HomeMain'

export default function Page({stravaCookies}) {

    // const redirectUri = `${window.location.protocol}//${window.location.host}/`

  return (
    <div>
        {/* <DynamicComponentWithNoSSR stravaCookies={null} /> */}
        <HomeMain stravaCookies={null}></HomeMain>
    </div>
  )
}