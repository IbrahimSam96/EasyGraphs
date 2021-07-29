import React, { useEffect,  } from "react";
import _debounce from 'lodash.debounce';
import { createChart } from 'lightweight-charts';
import ReactDOM from "react-dom"
 

const  LivePortfolioGraph = (props) => {


useEffect(() => {
        
            if(props.g.current.children.length > 2){
        
                props.g.current.removeChild(props.g.current.lastChild)
                                  
                };
            
}, [props.g.current])


const otherOptions = {
topColor: "#000000",
bottomColor: "#031636",
lineColor: '#f41f6a',
lineWidth: 2,
crossHairMarkerVisible: false,
}

const options = {
    width: 0,
    height: 0,
    layout: {
    textColor: "#d1d4dc",
    backgroundColor: "#072241",
    },
    rightPriceScale: {
        scaleMargins: {
            top: 0.3,
            bottom: 0.25,
        },
    },
    timeScale: {
        visible: true,
    },
    crosshair: {
        vertLine: {
            width: 5,
            color: 'rgba(224, 227, 235, 0.1)',
            style: 0,
        },
        horzLine: {
            visible: false,
            labelVisible: true,
        },
    },
    localization: {
        priceFormatter: price => {
        const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
         return   nf.format(price)
        },

    },    
    grid: {
        vertLines: {
            color: 'rgba(42, 46, 57, 0)',
            visible:true
          
        },
        horzLines: {
            color: 'rgba(42, 46, 57, 0)',
       
        },
    },

}



const chart = React.useRef(createChart(props.g.current, options) ); 

const areaSeries = React.useRef(chart.current.addAreaSeries(otherOptions) );
 

areaSeries.current.setData([
    { time: '2019-04-11', value: 80.01 },
    { time: '2019-04-12', value: 96.63 },
    { time: '2019-04-13', value: 76.64 },
    { time: '2019-04-14', value: 81.89 },
    { time: '2019-04-15', value: 74.43 },
    { time: '2019-04-16', value: 80.01 },
    { time: '2019-04-17', value: 96.63 },
    { time: '2019-04-18', value: 76.64 },
    { time: '2019-04-19', value: 81.89 },
    { time: '2019-04-20', value: 74.43 },

    { time: '2019-04-21', value: 82.01 },
    { time: '2019-04-22', value: 92.63 },
    { time: '2019-04-23', value: 93.64 },
    { time: '2019-04-24', value: 95.89 },
    { time: '2019-04-25', value: 84.43 },
    { time: '2019-04-26', value: 90.01 },
    { time: '2019-04-27', value: 96.63 },
    { time: '2019-04-28', value: 106.64 },
    { time: '2019-04-29', value: 121.89 },
    { time: '2019-04-30', value: 94.43 },
])   


const renderCount = React.useRef(0);


useEffect( ()=> {

const handleResize = _debounce(() => {
    
chart.current.applyOptions({
    width: props.g.current.clientWidth , 
    height: props.g.current.clientHeight 
});

} ,10 ); 


window.addEventListener("resize", handleResize); 


// Clean Up
return () => {

window.removeEventListener('resize', handleResize);

}

},[props.g.current.clientHeight, props.g.current.clientWidth])



    function Chnageme() {

        var selectedcolor = document.getElementById("colorpicker").value;
        
        return  chart.current.applyOptions({ 
            layout: { 
                backgroundColor: selectedcolor, 
            },
             
        }); 
        
        }

    function Chnageme1() {

        var selectedcolor = document.getElementById("colorpicker1").value
        areaSeries.current.applyOptions({
        lineColor: selectedcolor,
    }); 
            
            }

    function Chnageme2() {

        var selectedcolor = document.getElementById("colorpicker2").value
        areaSeries.current.applyOptions({
        topColor: selectedcolor,
    }); 
                    
                    } 
                    
    function Chnageme3() {
            var selectedcolor = document.getElementById("colorpicker3").value
            areaSeries.current.applyOptions({
             topColor: selectedcolor,
                    }); 
                                    
            }   

     function Chnageme4() {
                var selectedcolor = document.getElementById("colorpicker4").value
            chart.current.applyOptions({ 
                layout: { 
                    textColor: selectedcolor, 
                },
                 
            });              
                }    
                 
 const element =       
<>
        <span>
        <input 
        id="colorpicker" 
        type="color" 
        defaultValue="#072241"
        onChange={Chnageme} 
         />
        
         <p>
            Background 
          </p>
        
        </span>
        
        <span>
        <input 
        id="colorpicker1" 
        type="color" 
        defaultValue="#f41f6a"
        onChange={Chnageme1} 
         />
        
         <p>
            Line 
          </p>
        
          </span>

        <br/> 
        
        <span>
        <input 
        id="colorpicker2" 
        type="color" 
        defaultValue='#000000'
        onChange={Chnageme2} 
         />
        
         <p>
            Top 
          </p>
        
          </span>
        
        
        <span>
        <input 
        id="colorpicker3" 
        type="color" 
        defaultValue='#031636'
        onChange={Chnageme3} 
         />
        
         <p>
            Bottom 
          </p>
        
          </span>
        <br/>
        
        <span>
        <input 
        id="colorpicker4" 
        type="color" 
        defaultValue='#031636'
        onChange={Chnageme4} 
         />
        
         <p>
            Text 
          </p>
        
          </span>
</> ;
        
ReactDOM.render(
element,
document.getElementById("customization")
);



return (

<>
<div style={{position:"relative", left:"5%", height:"100%", width:"100%", display:"none"}}>

{console.log(`${renderCount.current ++} time(s)`)}
</div>

</>

)}

export default LivePortfolioGraph




  {/* <div className="customiza"> 

      <p>
    Currency
  </p>

<div className="select-div">
      <select
        className="exchange"
        value={currency}
        onChange={ (e) => { setCurrency(e.target.value) } }
      >
    <option value="USD" label="USD">USD</option>
    <option value="EUR" label="EUR">EUR</option>
    <option value="JPY" label="JPY">JPY</option>
    <option value="GBP" label="GBP">GBP</option>
    <option disabled>────────────────</option>
    <option value="AED" label="AED">AED</option>
    <option value="ANG" label="ANG">ANG</option>
    <option value="ARS" label="ARS">ARS</option>
    <option value="AUD" label="AUD">AUD</option>
    <option value="BDT" label="BDT">BDT</option>
    <option value="CAD" label="CAD">CAD</option>
    <option value="CHF" label="CHF">CHF</option>
    <option value="COP" label="COP">COP</option>

    <option value="CNY" label="CNY">CNY</option>

    <option value="EGP" label="EGP">EGP</option>
    <option value="IDR" label="IDR">IDR</option>
    <option value="INR" label="INR">INR</option>
    <option value="JOD" label="JOD">JOD</option>
    <option value="KWD" label="KWD">KWD</option>
    <option value="LBP" label="LBP">LBP</option>
    <option value="MAD" label="MAD">MAD</option>
    <option value="NGN" label="NGN">NGN</option>
    <option value="PKR" label="PKR">PKR</option>
    <option value="PHP" label="PHP">PHP</option>
    <option value="QAR" label="QAR">QAR</option>
    <option value="RUB" label="RUB">RUB</option>
    <option value="SAR" label="SAR">SAR</option>
    <option value="SGD" label="SGD">SGD</option>
    <option value="SLS" label="SLS">SLS</option>
    <option value="TRY" label="TRY">TRY</option>

      </select>
    </div>


</div> */}


// import React, { useEffect, useState } from "react";
// import _debounce from 'lodash.debounce';
// import { createChart } from 'lightweight-charts';
 

// const  LivePortfolioGraph = (props) => {

// const otherOptions = {
// topColor: props.topColor,
// bottomColor: props.bottomColor,
// lineColor: props.lineColor,
// lineWidth: 2,
// crossHairMarkerVisible: false,
// }

// const options = {
//     width: 0,
//     height: 0,
//     layout: {
//     textColor: props.textColor,
//     backgroundColor: props.backgroundColor,
//     },
//     rightPriceScale: {
//         scaleMargins: {
//             top: 0.3,
//             bottom: 0.25,
//         },
//     },
//     timeScale: {
//         visible: true,
//     },
//     crosshair: {
//         vertLine: {
//             width: 5,
//             color: 'rgba(224, 227, 235, 0.1)',
//             style: 0,
//         },
//         horzLine: {
//             visible: false,
//             labelVisible: true,
//         },
//     },
//     localization: {
//         priceFormatter: price => {
//         const nf = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
//          return   nf.format(price)
//         },

//     },    
//     grid: {
//         vertLines: {
//             color: 'rgba(42, 46, 57, 0)',
//             visible:true
          
//         },
//         horzLines: {
//             color: 'rgba(42, 46, 57, 0)',
       
//         },
//     },

// }


// const chart = React.useRef(createChart(props.g.current, options) );

// var areaSeries = React.useRef(chart.current.addAreaSeries(otherOptions) );
    
//     areaSeries.current.setData([
//         { time: '2019-04-11', value: 80.01 },
//         { time: '2019-04-12', value: 96.63 },
//         { time: '2019-04-13', value: 76.64 },
//         { time: '2019-04-14', value: 81.89 },
//         { time: '2019-04-15', value: 74.43 },
//         { time: '2019-04-16', value: 80.01 },
//         { time: '2019-04-17', value: 96.63 },
//         { time: '2019-04-18', value: 76.64 },
//         { time: '2019-04-19', value: 81.89 },
//         { time: '2019-04-20', value: 74.43 },
    
//         { time: '2019-04-21', value: 82.01 },
//         { time: '2019-04-22', value: 92.63 },
//         { time: '2019-04-23', value: 93.64 },
//         { time: '2019-04-24', value: 95.89 },
//         { time: '2019-04-25', value: 84.43 },
//         { time: '2019-04-26', value: 90.01 },
//         { time: '2019-04-27', value: 96.63 },
//         { time: '2019-04-28', value: 106.64 },
//         { time: '2019-04-29', value: 121.89 },
//         { time: '2019-04-30', value: 94.43 },
//     ]) 
    
// const renderCount = React.useRef(1);

// useEffect( ()=> {

// const handleResize = _debounce(() => {
    
// chart.current.applyOptions({
//     width: props.g.current.clientWidth, 
//     height: props.g.current.clientHeight 
// });

// } ,10 ); 

// const handleStyle  = _debounce(() => { 

//     // while(props.g.current.children.length > 2){

//     //     props.g.current.removeChild(props.g.current.lastChild)
              
//     //     };

// chart.current.applyOptions({ 
//     layout: { 
//         backgroundColor:props.backgroundColor, 
//         textColor: props.textColor
//     },
     
// }); 

// areaSeries.current.applyOptions({
//     lineColor: props.lineColor,
//      topColor:props.topColor, 
//      bottomColor:props.bottomColor 
//     }); 

// }, 10)


// window.addEventListener("resize", handleResize); 
// window.addEventListener("input", handleStyle); 



// // Clean Up
// return () => {

// window.removeEventListener('resize', handleResize);

// window.removeEventListener('input', handleStyle);

// }

// },[props])



// return (
// <>
// <div style={{position:"relative", left:"5%", height:"100%", width:"100%", display:"none"}}>


// {console.log(`${renderCount.current ++} time(s)`)}
// </div>
// </>
// )

// }

// export default LivePortfolioGraph;