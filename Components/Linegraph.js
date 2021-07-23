import React, { useState } from "react";
import Highcharts from "highcharts";
import HightchartsReact from "highcharts-react-official";

const LineGraph = () => {

const [option, setOption] = useState({ 

    title: {
        text: 'Solar Growth 2020(Q1-Q3)', 
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
        renderTo:"LineGraph",
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
    series: [{
        name: 'Installation',
        data: [ [1577854800000, 43934], [1577941200000, 52503 ], [1578027600000, 57177], [1578114000000,69658], [1578200400000, 97031], [1578286800000, 119931], [1578373200000, 137133], [1578459600000, 154175]], 
    }, {
        name: 'Manufacturing',
        data: [ [1577854800000, 24916],[ 1577941200000, 24064], [1578027600000, 29742], [1578114000000, 29851], [1578200400000,32490], [1578286800000, 30282], [1578373200000, 38121], [1578459600000,40434]]
    }, {
        name: 'Sales & Distribution',
        data: [[1577854800000, 11744], [1577941200000, 17722], [1578027600000, 16005], [1578114000000, 19771], [1578200400000, 20185], [1578286800000, 24377], [1578373200000, 32147], [1578459600000, 39387]]
    }, {
        name: 'Project Development',
        data: [[1577854800000, null], [1577941200000, null], [1578027600000, 7988], [1578114000000, 12169], [1578200400000, 15112], [1578286800000, 22452], [1578373200000, 34400], [1578459600000, 34227]]
    }, {
        name: 'Other',
        data: [[1577854800000, 12908], [1577941200000, 5948], [1578027600000, 8105], [1578114000000, 11248], [1578200400000, 8989], [1578286800000, 11816], [1578373200000, 18274], [1578459600000, 18111]]
    }],

    tooltip: {
        xDateFormat: '%Y-%m-%d',
        pointFormat: `<span style="color:{series.color}">{series.name}</span>: $ {point.y} <b>  {point.change} </b>`,
        valueDecimals: 2, 
     },
      
})


const renderHighChartCard = (
<HightchartsReact
 highcharts={Highcharts}
constructorType={'chart'}
options={option} /> 
); 


    return (

        <div> 

        {renderHighChartCard}
        
        </div>

        )
}

export default LineGraph; 