import { firebaseAdmin } from "../../../FirebaseAdmin";
import nookies from "nookies";
import moment from 'moment';
import AddIcon from '@material-ui/icons/Add';

import CloseIcon from '@material-ui/icons/Close';
import { firebaseClient } from "../../../FirebaseIntialization";

import React, { useEffect, useState, useRef } from "react";

export const getServerSideProps = async (context) => {

    const db = firebaseAdmin.firestore(); 
    const usersRef = db.collection("Users");

    try{

    const cookies = nookies.get(context);

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const route = context.query.user;

   console.log(context.query)
   
    const sameuser = uid == route.toString();
    const userAccount = db.collection("Users").doc(route);

    const list = [];

    const userinfo = []

        await usersRef.get().then((snapchot) => {

            snapchot.forEach((doc) => {

                if(doc.exists) {
                console.log(doc.data().uid )

                list.push(doc.data().uid )

                }
            })
        });


        const userexists = list.includes(route.toString())

        if(userexists){
        
          await userAccount.get().then((doc) => {
                        if(doc.exists) {
                          userinfo.push(doc.data() ) 
                                console.log( doc.data(), "yA ayre" )
                                         
                                         }
                    })


                  }
 
    const Dashboards = [];

    const userDashboards = db.collection("Users").doc(context.query.user).collection("Dashboard").orderBy('date', 'desc');
  
    await userDashboards.get().then((snapchot) => {
        
        snapchot.forEach((obj) => {

            if(obj.exists){

                Dashboards.push( obj.id.toString() )
    
                console.log(obj.id)

                }
        })

        })

        

        const Layout = []; 

        await Promise.all( Dashboards.map( async (obj) => {

          const layoutRef =  db.collection("Users").doc(context.query.user).collection("Dashboard")
          .doc(obj);

          await layoutRef.get().then((doc) => {

            if(doc.exists) {

              Layout.push(JSON.stringify(doc.data() ) ) 
                    console.log( doc.data() )
                             
                             }
        }) 

        }) 

        ) 
  

    return {
        props: {  
             token, 
             email,
             uid,
             route,
             userexists,
             Dashboards,
             userinfo,
             sameuser,
             Layout
        
         }
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

const UserProfile1 = (props) => {

  const createdDates = []; 

  const Combined = []; 

  props.Layout.map((obj) => { 

    createdDates.push( new Date(JSON.parse(obj).date._seconds * 1000) )

  })

  const desDates = createdDates.sort( (a , b) => { return b - a} )

  const [CombinedDashboards, setCombinedDashboards] = useState(Combined)



  for(var i = 0 ; i < props.Dashboards.length; i++) {
    Combined.push({
      dashboard: props.Dashboards[i],
      [props.Dashboards[i]]: moment(desDates[i]).fromNow()
    })
  
  }



console.log(CombinedDashboards, "Combined STATE")

console.log(desDates, "desDates")

console.log(props.Dashboards, "Dashboards")


// console.log( moment(new Date(JSON.parse(obj).date._seconds  * 1000) ).fromNow() )


return (

<div className="ProfilePage" >

{

props.userexists ?  

<>

<div className="ProfilepageUser">

{
props.userinfo[0].name ? 

<a href={`${props.userinfo[0].uid}`}>{props.userinfo[0].name.split(" ")[0]} </a>

:
<a href={`${props.userinfo[0].uid}`}>  {props.userinfo[0].email}   </a>

}


<span> <AddIcon /> <a href="/create"> New Dashboard</a>  </span>


</div>

<div className="ProfilepageDashboards">

{props.Dashboards.length ? 

CombinedDashboards.map(( obj , k) => ( 

<div className="DashboardTile" > 

<span> {k+1} </span>

<span> <a key={k} href={`/users/${props.route}/${obj.dashboard}`}> {obj.dashboard} </a> </span>

<span> <p> {obj[`${obj.dashboard}`]} </p> </span>

<span> <a href={`/edit/${props.uid}/${obj.dashboard}`}> Edit </a> </span>

 <span> <CloseIcon onClick={ async () => {

 console.log("tried")

const newSetofDashboards = CombinedDashboards.filter( (obj1 ) =>  obj1.dashboard !== obj.dashboard )

setCombinedDashboards(newSetofDashboards)

if(window !== "undefined") {
 
  const clientDb = firebaseClient.firestore();  

 const docref = clientDb.collection("Users").doc(props.uid)
   .collection("Dashboard").doc(obj.dashboard); 
   
   await docref.delete().then(() => {
    console.log("Document successfully deleted!");
}).catch((error) => {
    console.error("Error removing document: ", error);
});


    }
}} ></CloseIcon> </span>

<span> </span>

</div>
  ))

:


<div className="NoDashboardTitle" > 

<span > No dashboards created </span>

 </div>

}

</div>

</>




:
// Show Error Page 

<div>

<span> Sorry,This User Does'nt Exsist   </span> 

</div>



}
</div>

)

}

export default UserProfile1
