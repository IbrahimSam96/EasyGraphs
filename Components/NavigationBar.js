import Link from 'next/link'
import { useRouter } from 'next/router'
import {useState} from "react"
import { firebaseClient } from "../FirebaseIntialization";


const Navbar = (props) => { 

const router = useRouter();


return (

<div className="Navbar">

    <div className="GraphX">

    <div className="hodl" 
    style={{ width:'100%', height:"75px", color:"white",
     backgroundColor:"transparent", display:"grid",
      gridTemplateColumns:"repeat(2, 1fr)", 
      gridTemplateRows:"repeat(1, 75px)"}} >
    <span style={{gridColumn:"1/3", gridRow:"1/1", 
    fontSize:"1.1rem", paddingTop:"25px", paddingLeft:"25px", 
    fontFamily:"'Trebuchet MS',  Arial, sans-serif",
     cursor:"pointer" }}><a href="/">QuickGraphs</a></span>

    </div>

    </div>

    
  <div className="Dashboards">

    <Link className="NavLink" href= "#"> 
    <div className="hodl" 
    style={{ width:'100%', height:"75px", color:"white",
     backgroundColor:"transparent", display:"grid",
      gridTemplateColumns:"repeat(2, 1fr)", 
      gridTemplateRows:"repeat(1, 75px)"}} >
    <span style={{gridColumn:"1/3", gridRow:"1/1", fontSize:"1.1rem", paddingTop:"25px", paddingLeft:"25px", fontFamily:"'Trebuchet MS',  Arial, sans-serif", cursor:"pointer" }}>Dashboards</span>

    </div>
    </Link> 

    <span className="report-tooltip2"><p>coming soon!</p> </span>
    </div>
    
    
    <div className="Reports">

    <Link className="NavLink" href= "#"> 
    <div className="hodl" 
    style={{ width:'100%', height:"75px", color:"white",
     backgroundColor:"transparent", display:"grid",
      gridTemplateColumns:"repeat(2, 1fr)", 
      gridTemplateRows:"repeat(1, 75px)"}} >
    <span style={{gridColumn:"1/3", gridRow:"1/1",
     fontSize:"1.1rem", paddingTop:"25px", paddingLeft:"25px", 
     fontFamily:"'Trebuchet MS',  Arial, sans-serif",
      cursor:"pointer"}}> 
      Reports
       </span>

    </div>
    </Link> 

    <span className="report-tooltip"><p>coming soon!</p> </span>
    </div>

    


{props.email ?


// User Layout
<div className="UserAccount">

{props.token.name ? 

 <span className="email" style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
 {props.token.name.split(" ")[0]} 
 </span>
 :
 <span className="email" style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
 {props.email} 
 </span>
}

  <div className="emailTooltip">
  
   <button
   className="SignOutButton"
   style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}
        onClick={async () => {
          await firebaseClient
            .auth()
            .signOut()
            .then(() => {
              router.push("/");
            });
        }}
      >
        Sign out
      </button> 

      <span className="ProfileLink " style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
      <a href= {`/users/${props.uid}`} style={{ textDecoration: 'none' }}>
        Profile
        </a>
      </span>
    
      
      <span className="CreateLink " style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
      <a href= "/create" style={{ textDecoration: 'none' }}>
        Create
        </a>
      </span>
 
    

      </div>

    </div>
    
 
   :

  //  Non-User Layout
   <div className="Anonymous ">

   <Link  href="/signup"> 
   <a style={{width:"100%", height:"50%", maxWidth:"80px" }} >
  <span className="SignUp" style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
  Sign Up
  </span>
  </a>
  </Link> 

  <Link href="/login"> 
  <a style={{width:"100%", height:"50%", maxWidth:"80px"}} >
  <span className="LogIn" style={{fontFamily:"'Trebuchet MS',  Arial, sans-serif" , color:"white",fontSize:"1.2rem" }}>
  Log In
  </span> 
  </a>
  </Link> 

     </div>

 }





    </div>

    )
}

export default Navbar
