import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HightchartsReact from "highcharts-react-official";

import { firebaseClient } from "../FirebaseIntialization";
import CloseIcon from '@material-ui/icons/Close';
import { Rnd } from "react-rnd";
import data from "highcharts/modules/data";


if (typeof Highcharts === 'object') {
    data(Highcharts); // Execute the data module

}


const EditGraph = (props) => {


var arr = [];
    
for (var i = 0; i < props.data.length;  i += 2) {
    
arr[i] =  [props.data[i] , Number(props.data[i+1]) ] 

}



const [option, setOption] = useState({ 
    title: {
        text: props.title, 
        style:{
            color:props.tooltiptextcolor,
            fontFamily:" Trebuchet MS,  Arial, sans-serif",
            fontWeight:"bold",
            fontSize:"1.5rem",
        }
    },
    legend: {
        enabled: props.legend,
        itemStyle:{
        color:props.tooltiptextcolor
        },
    },
    credits: {
        enabled: false
    },
    chart: {
        height:props.height,
        width: props.width,
        // renderTo:"createdGraph", 
        backgroundColor: "transparent", 
    },
    plotOptions: {
        series: {
            compare:"percent"
        }
    },
    xAxis: {
    // type:"datetime",
    //  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
     gridLineColor: 'transparent',
     visible: props.xAxis,
     labels: {
        style: {
            color: props.axisColor
        }
    },
    }, 
    yAxis: {
        visible: props.yAxis,
        gridLineColor: 'transparent',
        labels: {
            style: {
                color: props.axisColor
            }
        },
    }, 
    data: {
        googleSpreadsheetKey: props.gk,
        googleSpreadsheetWorksheet:props.gs,
        startColumn: props.gsc,
        endColumn: props.gec,
        startRow:props.gsr,
    },
    series: [{
        name:props.seriestitle,
        type: props.type,
        color:props.color,
        data: arr.filter(item => item)
    }
],
    tooltip: {
        style: {
            color: props.tooltiptextcolor,
            fontWeight: 'bold'
        },
        xDateFormat: '%Y-%m-%d',
        pointFormat: `<span style="font-size: 1.0rem; "> {series.name}</span>:
          <b>  <span style="font-size: 1.0rem; ">{point.y}</span> </b>`,
        valueDecimals: 2, 
        backgroundColor:props.tooltipcolor,
     },
})

const [x, setX]= useState(0);
const [y, setY]= useState(0);

const [width, setWidth]= useState(550);
const [height, setHeight]= useState(400);

const graphRef = useRef(null); 


const renderHighChartCard = (

<HightchartsReact highcharts={Highcharts} constructorType={'chart'} options={option} ref={graphRef} /> 
); 


return (

<Rnd 
bounds="parent"
default={{
          x: props.x,
          y: props.y,
          width: props.width,
          height: props.height 
        }}

onDragStop={ (e, d) => { 
    
    setX(d.x)
    setY(d.y)

    if(window !== "undefined") {

        const clientDb = firebaseClient.firestore();  
        
        const docref = clientDb.collection("Users").doc(props.uid)
        .collection("Dashboard").doc(props.docID).collection("Graphs"); 
        docref.where("id" , "==", `${props.id}`)
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

const chart = graphRef.current && graphRef.current.chart


    if(chart){

        chart.reflow()
    }  
    setWidth(ref.offsetWidth);
    setHeight(ref.offsetHeight);

    if(window !== "undefined") {

        const clientDb = firebaseClient.firestore();  
        
        const docref = clientDb.collection("Users").doc(props.uid)
        .collection("Dashboard").doc(props.docID).collection("Graphs"); 
        docref.where("id" , "==", `${props.id}`)
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

if(window !== "undefined") {

const clientDb = firebaseClient.firestore();  

const docref = clientDb.collection("Users").doc(props.uid)
.collection("Dashboard").doc(props.docID).collection("Graphs"); 
docref.where("id" , "==", `${props.id}`)
.get()
.then((querySnapshot) => {
   querySnapshot.forEach((doc) => {
        docref.doc(doc.id).delete()
   });
})

}  

const newgraphs = props.existingGraphs.filter( (object, kk) => `${object.id}` !== `${props.id}`); 
props.setexistingGraphs(newgraphs);

}}
style={{color:"#c7c9d3", 
fontSize:"1.5rem"}}
/>  
{renderHighChartCard}

</div>
</Rnd>

);

}



export default EditGraph ; 