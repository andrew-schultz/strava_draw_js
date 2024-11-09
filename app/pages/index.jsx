'use client'
import dynamic from 'next/dynamic'
import HomeMain from '../components/HomeMain'
 
const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/HomeMain'),
    { ssr: false }
)
 
export default function Page({stravaCookies}) {
  return (
    <div>
        <DynamicComponentWithNoSSR stravaCookies={null} />
        {/* <HomeMain stravaCookies={null}></HomeMain> */}
    </div>
  )
}