import { firebaseAdmin } from "../../../../FirebaseAdmin";

import {React, useEffect, useRef, useState} from "react"
import nookies from "nookies";
import ViewGraph from "../../../../Components/viewGraph";

import ViewTextBox from "../../../../Components/viewText";

import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Modal from 'react-bootstrap/Modal';

import {
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon
  } from 'next-share'

export const getServerSideProps = async (context) => {

    try{

        const db = firebaseAdmin.firestore(); 
        const usersRef = db.collection("Users");

    const cookies = nookies.get(context);

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const route = context.query.user + context.query.dashboard ;

    console.log(context.query.dashboard) 
    console.log(context.query.user) 

    const routeU = context.query.user
    const routeG = context.query.dashboard

    const sameuser = uid == context.query.user.toString();


    const list = [];

        await usersRef.get().then((snapchot) => {

            snapchot.forEach((doc) => {

                if(doc.exists) {

                console.log(doc.data().uid )

                list.push(doc.data().uid )

                }
            })
        });

        const userexists = list.includes(context.query.user.toString() ); 

        console.log(userexists) 

        const Dashboards = [];


        const userDashboards = db.collection("Users").doc(context.query.user).collection("Dashboard");

            await userDashboards.get().then((snapchot) => {
                
                snapchot.forEach((obj) => {
        
                    if(obj.exists){
        
                        Dashboards.push( obj.id.toString() )
            
                        console.log(obj.id)
        
                        }
                })
        
                }) 

                const dashboardexists = Dashboards.includes( context.query.dashboard.toString() )
                
                console.log(dashboardexists) 

                const Graphs = [] 


                const Texts = [] 
            
                const Layout = []

                const Creator = []

                const  graphRef =  db.collection("Users").doc(context.query.user).collection("Dashboard").doc(context.query.dashboard).collection("Graphs");
                   
                const  textRef =  db.collection("Users").doc(context.query.user).collection("Dashboard").doc(context.query.dashboard).collection("Text");
                
                const  layoutRef =  db.collection("Users").doc(context.query.user).collection("Dashboard").doc(context.query.dashboard);

                const createrRef = db.collection("Users").doc(context.query.user)

                    await graphRef.get().then((snapshot) => {

                        snapshot.forEach((obj) => { 

                            if(obj.exists){
                            Graphs.push( obj.data() )

                            }
                        })
                    })

            
                await textRef.get().then((snapshot) => {
                        snapshot.forEach((obj) => { 
                            if(obj.exists){
                            Texts.push( obj.data() )
                
               
                            }
                        })
                    })
            
            // Firestore timestamp 
                 await layoutRef.get().then((doc) => {
                        if(doc.exists) {
                            Layout.push(JSON.stringify(doc.data() ) ) 
                                console.log( doc.data() )
                                         
                                         }
                    })

                    await createrRef.get().then((doc) => {
                        if(doc.exists) {
                            Creator.push(doc.data() ) 
                                console.log( doc.data() )
                                         
                                         }
                    })
             

    return {
        props: {  
             token, 
             email,
             uid,
             route,
             routeU,
             routeG,
             Graphs,
             Texts,
             Layout,
             userexists,
             dashboardexists,
             Dashboards,
             Creator,
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
                
        props: {
           
        },
      };
    }
  };

  

const Dashboard1 = (props) => {

console.log(props.userexists)
console.log(props.dashboardexists)
console.log(props.Dashboards)
console.log(props.Graphs)

console.log(props.Texts)

console.log(props.Creator) 

const layout = JSON.parse(props.Layout)

const createdDate = new Date(layout.date._seconds * 1000)

console.log(moment(createdDate).fromNow())

const [show3 , setShow3] = useState(false); 

const Present = ( 
    <>
    <Modal 
    show={show3}
    style={{opacity:3}}
    onHide={ () => setShow3(false) } >

<Modal.Header bsPrefix="PresentDashboard" >


</Modal.Header>

<Modal.Body  bsPrefix="PresentDashboardBody" >


</Modal.Body>

</Modal>
  </>
  );


return (


<div className="DashboardPage" >


{ props.dashboardexists? 

<>


<div className="DashboardPage1">

<div className="DashboardPage2">

<div className="DashboardPage3" style={{
    backgroundColor:`${layout.backgroundColor}`,
    width:`${layout.width}px`,
    height: `${layout.height}px`,
    borderColor:`${layout.borderColor}`
}} >


{ props.Graphs.map( (si, k) => (
      
      <>
             <ViewGraph
                key={k}
                 type={si.type} title={si.title} seriestitle={si.seriestitle}
                 legend={si.legend} xAxis={si.xAxis} 
                 yAxis={si.yAxis}    
                 color={si.color}
                 tooltipcolor={si.tooltipcolor}
                 tooltiptextcolor={si.tooltiptextcolor}
                 axisColor={si.axisColor}
                 gk={si.gk}
                 gs={si.gs}
                 gsc={si.gsc}
                 gec={si.gec}
                 gsr={si.gsr}
                 data={si.data}
                 x={si.x}
                 y={si.y}
                 width={si.width}
                 height={si.height}
                  />
      
                
      </>
           
      
           ))
      }

{ props.Texts.map( (si, k) => (

<> 
   <ViewTextBox key={k}
       text={si.text} 
       textColor={si.textColor}
        bold={si.bold}
        italic={si.italic}
        underline={si.underline}
        justify={si.justify} 
        center={si.center}
        textSize={si.textSize}
        x={si.x}
        y={si.y}
        width={si.width}
        height={si.height}
        />
      
       </>
    
 ))}
      

</div>

</div>


</div>


<span className="EditInfo"> <a href={`/edit/${props.uid}/${props.routeG}`}> Edit </a></span>

<span className="EditInfo2"> {layout.views} <VisibilityIcon /> </span>




</>

:

<>

</>
}

{
    props.userexists  ?  

<div className="CreaterState">


<span>Created</span>

<span> {moment(createdDate).fromNow()}</span>



</div>
    :
    // Show Error Page 
    
    <div>
    
    <h1> Sorry, User Dashboard Does'nt Exsist   </h1> 
    
    </div>
    
    }


    </div>

    
    )
    
    }
    
    export default Dashboard1
    