import React, { useEffect, useState, useRef } from "react";

import { firebaseClient } from "../FirebaseIntialization";
import CloseIcon from '@material-ui/icons/Close';
import { Rnd } from "react-rnd";

const TextBox = (props) => { 

    const [x, setX]= useState(0);
    const [y, setY]= useState(0);
    
    const [width, setWidth]= useState(250);
    const [height, setHeight]= useState(250);


    return (

        <Rnd 
        bounds="parent"
        default={{
            x: 50,
            y: 5,
            width: width,
            height: height 
          }}

          onDragStop={(e, d) => { 
            setX(d.x)
            setY(d.y)
        
            if(window !== "undefined") {
        
                const clientDb = firebaseClient.firestore();  
                
                const docref = clientDb.collection("Users").doc(props.uid)
                .collection("Dashboard").doc(props.docID).collection("Text"); 
                docref.where("id" , "==", `${props.text}${props.textColor}`)
                .get()
                .then((querySnapshot) => {
                   querySnapshot.forEach((doc) => {
                        docref.doc(doc.id).update({
                            x:d.x,
                            y:d.y
                        })
                   });
                })
                
                } 
        
        }}
        
        onResizeStop={(e, direction, ref, delta, position) => {
        

            setWidth(ref.offsetWidth);
            setHeight(ref.offsetHeight);
        
            if(window !== "undefined") {
        
                const clientDb = firebaseClient.firestore();  
                
                const docref = clientDb.collection("Users").doc(props.uid)
                .collection("Dashboard").doc(props.docID).collection("Text"); 
                docref.where("id" , "==", `${props.text}${props.textColor}`)
                .get()
                .then((querySnapshot) => {
                   querySnapshot.forEach((doc) => {
                        docref.doc(doc.id).update({
                            width:ref.offsetWidth,
                            height:ref.offsetHeight
                        })
                   });
                })
                
                } 
                  
                  }}
        > 
        <div className="resizablebox" > 
        <CloseIcon  
        onClick={ () => {

          const newtext = props.numberofText.filter( (object, kk) =>  object.id !== `${props.text}${props.textColor}${props.textSize}` ) 
         
          props.setnumberofText(newtext);
 
          if(window !== "undefined") {
 
           const clientDb = firebaseClient.firestore();  
   
          const docref = clientDb.collection("Users").doc(props.uid)
            .collection("Dashboard").doc(props.docID).collection("Text"); 
            docref.where("id" , "==", `${props.text}${props.textColor}`)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                     docref.doc(doc.id).delete();
                });
            })
        
             }
 
        }}
          style={{color:"#c7c9d3", 
           fontSize:"1.5rem"}}
          />  
  
      <span style={{color:props.textColor, 
      fontWeight: props.bold ? "bold": "normal", 
      fontFamily:"Trebuchet MS,  Arial, sans-serif",
      fontStyle: props.italic? "italic": "normal",
      textDecoration: props.underline? "underline": "none",
      textAlign: props.justify ? "justify" : props.center? "center" : "normal" ,
     
      }}>
      <h2 style={{fontSize:`${props.textSize}em`}}>{props.text}</h2>
      </span>

      </div>
          </Rnd>
    )

  }

  export default TextBox;