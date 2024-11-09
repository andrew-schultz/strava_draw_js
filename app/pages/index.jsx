import HomeMain from '../components/HomeMain'
 
export default function Page({stravaCookies}) {
  return (
    <div>
        {/* <DynamicComponentWithNoSSR stravaCookies={null} /> */}
        <HomeMain stravaCookies={null}></HomeMain>
    </div>
  )
}