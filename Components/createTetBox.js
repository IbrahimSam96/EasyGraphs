import React, { useEffect, useState, useRef } from "react";

const CreateTextBox = (props) => { 

    

    return (

      <span style={{color:props.textColor, 
      fontWeight: props.bold ? "bolder": "normal", 
      fontFamily:"Trebuchet MS,  Arial, sans-serif",
      fontStyle: props.italic? "italic": "normal",
      textDecoration: props.underline? "underline": "none",
      textAlign: props.justify ? "justify" : props.center? "center" : "normal" ,
      }}>
      <h2 style={{fontSize:`${props.textSize}em`}}>{props.text}</h2>
      </span>
     
    )

  }

  export default CreateTextBox;