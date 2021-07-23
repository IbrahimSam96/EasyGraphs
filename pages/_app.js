import "../Styles.css";
import Navbar from "../Components/NavigationBar";
//Firebase Authentication
import '../FirebaseIntialization' 
import {AuthProvider} from "../Authenticator"
import Head from 'next/head';


import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

function MyApp({ Component, pageProps }) {

    const router = useRouter()
    useEffect(() => {
      const handleRouteChange = (url) => {
        gtag.pageview(url)
      }
      router.events.on('routeChangeComplete', handleRouteChange)
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [router.events])
  

 return (

<>

<AuthProvider>

<div className="Main">

<Head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
</Head>

<Navbar {...pageProps}  />

<Component {...pageProps} />

</div>

</AuthProvider>

</>

)


}

export default MyApp


