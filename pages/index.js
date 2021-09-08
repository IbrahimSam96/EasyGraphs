import Head from 'next/head';
import Image from 'next/image'
import dynamic from 'next/dynamic'

import React, { useRef, useState, useMemo, useEffect } from 'react';

import nookies from "nookies";

// Admin service account/ FirebaseSDK 
import { firebaseAdmin } from "../FirebaseAdmin";


//  Components
import LineGraph from "../Components/Linegraph"
import BarGraph from "../Components/GoogleSheets"
import _debounce from 'lodash.debounce';


const LivePortfolioGraph = dynamic(() => {

  return import("../Components/FinancialChartIntro")
}, { ssr: false }

);





export const getServerSideProps = async (context) => {
  try {
    const cookies = nookies.get(context);
    console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    const db = firebaseAdmin.firestore();

    // Add a new document in collection "Users"
    db.collection("Users").doc(uid).set({
      uid: uid,
      email: email,
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: { email, uid, token },

    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      props: {},
    };
  }
};



const Main = (props) => {



  if (props.token) {

    if (props.token.name) {
      console.log(` Hello ${props.token.name.split(" ")[0]} :)`)
    }

  }


  const g = useRef(null);


  return (

    <>
      <Head>
        <title> Create Free Financial Graphs, Interactive Dashboards, and Live Reports --GraphX </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="landing">

        <div className="landing-bar" >

        </div>

        <div className="landing-intro">

          <h2>
            Create Free Interactive Charts & Dashboards.
          </h2>
          <p>
            GraphX is a <strong> social visual development platform </strong>
            for all types of professionals to create visuals and insights
            to help paint pictures,
            showcase dashbaords
            and build collections of data driven visuals.
          </p>

          <div className="LineGraph">
            <LineGraph />

          </div>

        </div>

        <div className="landing-intro2" >
          {/* https://docs.google.com/spreadsheets/d/1eK264_It9ezV8g1Ah_PROiOiOMkKg3KYszvcNHbjso0/edit#gid=0 */}
          <h2>
            Connect your Charts using Google Sheets.
          </h2>

          <p>
            Easily colllaborate with your peers
            to create up-to date charts
            using google sheets.

          </p>

          <div className="GoogleSheets-Logo">
            <a href="https://docs.google.com/spreadsheets/d/1eK264_It9ezV8g1Ah_PROiOiOMkKg3KYszvcNHbjso0/edit#gid=0" target="
       _blank">
              <Image
                src="/google-sheets.svg"
                alt="Google-Sheets"
                width={100} height={100} layout="responsive"

              />
            </a>
          </div>

          <div className="GoogleSheetsExample">
            <BarGraph />
          </div>

        </div>

        <div className="landing-intro3">

          <h2>
            Display & Customize Stunning Financial Charts  :)
          </h2>

          <div id="customization">

          </div>

          <div ref={g} className="FinancialChartIntro" >



            <LivePortfolioGraph g={g} />

          </div>

        </div>


        <div className="getStarted">

          <a href="/create">
            Get Started
          </a>



        </div>

        {/* <video playsInline autoPlay loop muted className="landing-video">

        <source src={ require("../public/landingVideo1.mp4") }  type="video/mp4" />

          </video> */}

      </div>

    </>


  )

}

export default Main




