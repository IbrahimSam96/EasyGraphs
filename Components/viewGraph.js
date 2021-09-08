import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HightchartsReact from "highcharts-react-official";
import { Rnd } from "react-rnd";
import data from "highcharts/modules/data";


if (typeof Highcharts === 'object') {
    data(Highcharts); // Execute the data module

}


const ViewGraph = (props) => {

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
        googleAPIKey: 'AIzaSyBexUOGa1JtQ1ZI7-29gUBUQkHL_GBmOpA',
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





const viewHighChartCard = (

<HightchartsReact highcharts={Highcharts} constructorType={'chart'} options={option}  /> 
); 



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


<div> 
 
{viewHighChartCard}

</div>
</Rnd>

);

}



export default ViewGraph ; 