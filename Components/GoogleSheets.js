import React, { useState } from "react";
import Highcharts from "highcharts";
import HightchartsReact from "highcharts-react-official";
import data from "highcharts/modules/data";


if (typeof Highcharts === 'object') {
    data(Highcharts); // Execute the data module

}

const BarGraph = () => {


const [option, setOption] = useState({ 

    title: {
        text: 'Source: GoogleSheets', 
        style:{
            color:"white",
            fontFamily:" Trebuchet MS,  Arial, sans-serif",
            fontWeight:"bold",
            fontSize:"1.5rem",
            
        }

    },
    legend: {
        enabled: true,
        itemStyle:{
        color:"white"
        },
    },
    credits: {
        enabled: false
    },
    chart: {
        renderTo:"GoogleSheetsExample",
        backgroundColor: "transparent", 
    },
    plotOptions: {
        series: {
            compare:"percent"
        }
    },
    xAxis: {
        type: 'datetime',
        gridLineColor: 'transparent',
        visible: false
    }, 
    yAxis: {
        visible: false
    }, 
    data: {
        googleSpreadsheetKey:"1eK264_It9ezV8g1Ah_PROiOiOMkKg3KYszvcNHbjso0",
        googleSpreadsheetWorksheet:"1",
        startColumn: 0,
        endColumn: 1,
        startRow: 0,
    },
    series: [{
        name:"",
        type:"column",
        color:"#F43B5F",
    }],
    tooltip: {
        xDateFormat: '%Y-%m-%d',
        pointFormat: `<span style="color:{series.color}; background-color: teal;" > {series.name}</span>:  $ {point.y} <b>  {point.change} </b> `,
        valueDecimals: 2, 
     },
      
})

const renderHighChartCard = (
<HightchartsReact
 highcharts={Highcharts}
constructorType={'chart'}
options={option}

/>
); 

    return (

        <div> 

        {renderHighChartCard}
        
        </div>

        )
}

export default BarGraph; 