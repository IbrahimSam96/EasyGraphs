import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";

const ViewTextBox = (props) => { 

    return (

    <Rnd 
        bounds="parent"
        disableDragging={true}
        enableResizing={false}
        default={{
            x: props.x,
            y: props.y,
            width: props.width,
            height: props.height 
          }}

        > 
    <div > 
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

  export default ViewTextBox;