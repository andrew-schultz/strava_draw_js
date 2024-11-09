
import Page from './pages/index'
// import { cookies } from 'next/headers'

export default async function Home() {
  let stravaCookies = null;
  // const cookieStore = await cookies().then((cstore) => {
  //   stravaCookies = cstore.get('scr');
  // })
  
  // return (
  //     <main className="">
  //       {stravaCookies ? (
  //           <HomeMain stravaCookies={stravaCookies}></HomeMain>
  //         ) : (
  //           <HomeMain stravaCookies={null}></HomeMain>
  //         ) 
  //       }
  //     </main>
  // )
  return (
    <main className="">
      <Page stravaCookies={null} />
    </main>
  )
}
