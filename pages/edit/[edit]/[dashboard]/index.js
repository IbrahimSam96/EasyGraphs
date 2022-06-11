
import { firebaseAdmin } from "../../../../FirebaseAdmin";
import nookies from "nookies";
import { React, useEffect, useRef, useState } from "react"
import Image from 'next/image'
import { firebaseClient } from "../../../../FirebaseIntialization";
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import AddIcon from '@material-ui/icons/Add';
import WidgetsIcon from '@material-ui/icons/Widgets';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import CloseIcon from '@material-ui/icons/Close';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';

import { AreaChartOutlined, LineChartOutlined, PieChartOutlined, BarChartOutlined, } from '@ant-design/icons';

import Modal from 'react-bootstrap/Modal';
import _debounce from 'lodash.debounce';
import CreateGraph1 from "../../../../Components/createGraph";
import CreateGraph2 from "../../../../Components/renderGraph";
import TextBox from "../../../../Components/TextBox";

import EditGraph from "../../../../Components/editGraph";
import ViewTextBox from "../../../../Components/editTextBox";
import CreateTextBox from "../../../../Components/createTetBox";

export const getServerSideProps = async (context) => {

  try {
    const db = firebaseAdmin.firestore();
    const usersRef = db.collection("Users");

    const cookies = nookies.get(context);

    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const route = context.query.edit

    const dashboard = context.query.dashboard

    console.log(context.query)


    const list = [];

    await usersRef.get().then((snapchot) => {

      snapchot.forEach((doc) => {

        if (doc.exists) {

          console.log(doc.data().uid)

          list.push(doc.data().uid)

        }
      })
    });



    const Dashboards = [];


    const userDashboards = db.collection("Users").doc(uid).collection("Dashboard");

    await userDashboards.get().then((snapchot) => {

      snapchot.forEach((obj) => {

        if (obj.exists) {

          Dashboards.push(obj.id.toString())

          console.log(obj.id)

        }
      })

    })

    const dashboardexists = Dashboards.includes(context.query.dashboard.toString())

    console.log(dashboardexists)



    const Graphs = []


    const Texts = []

    const Layout = []


    const graphRef = db.collection("Users").doc(context.query.edit).collection("Dashboard").doc(context.query.dashboard).collection("Graphs");

    const textRef = db.collection("Users").doc(context.query.edit).collection("Dashboard").doc(context.query.dashboard).collection("Text");

    const layoutRef = db.collection("Users").doc(context.query.edit).collection("Dashboard").doc(context.query.dashboard);



    await graphRef.get().then((snapshot) => {

      snapshot.forEach((obj) => {

        if (obj.exists) {
          Graphs.push(obj.data())

        }
      })
    })


    await textRef.get().then((snapshot) => {
      snapshot.forEach((obj) => {
        if (obj.exists) {
          Texts.push(obj.data())


        }
      })
    })

    // // Firestore timestamp 
    await layoutRef.get().then((doc) => {
      if (doc.exists) {
        Layout.push(JSON.stringify(doc.data()))
        console.log(doc.data())

      }
    })



    return {
      props: {
        token,
        email,
        uid,
        route,
        dashboard,
        Graphs,
        Texts,
        Layout,


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


const EditPage = (props) => {

  //Modal Options
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);

  // Graph Styles or Data
  const [style, setStyle] = useState(true);
  const [GoogleSheets, setGoogleSheets] = useState(false)

  const [data, setData] = useState(
    new Map(
      Object.entries({
        datapoint1: "",
        datapoint2: "",
        datapoint3: "",
        datapoint4: ""
      })
    )
  );

  const [type, setType] = useState("column");
  const [title, setTitle] = useState("");
  const [seriestitle, setseriesTitle] = useState("");
  const [xAxis, setxAxis] = useState(false);
  const [yAxis, setyAxis] = useState(false);
  const [color, setColor] = useState("#7cb5ec");
  const [tooltipcolor, settooltipColor] = useState("black");
  const [tooltiptextcolor, settooltiptextColor] = useState("white");
  const [axisColor, setaxisColor] = useState("white");
  const [legend, setLegend] = useState(false);


  const [googleSheetKey, setgoogleSheetKey] = useState("");
  const [googleSheetNumber, setgoogleSheetNumber] = useState("");
  const [googleSheetStartColumn, setgoogleSheetStartColumn] = useState("");
  const [googleSheetEndColumn, setgoogleSheetEndColumn] = useState("");
  const [googleSheetStartRow, setgoogleSheetStartRow] = useState("");


  // Text options
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("white");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [justify, setJustify] = useState(false);
  const [center, setCenter] = useState(false);
  const [textSize, settextSize] = useState(1.2);


  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);


  const [numberofGraphs, setnumberofGraphs] = useState([]);

  const [numberofText, setnumberofText] = useState([]);

  const [existingGraphs, setexistingGraphs] = useState(props.Graphs);

  const [existingText, setexistingText] = useState(props.Texts);



  console.log(props.route)
  console.log(props.dashboard)
  console.log(props.Graphs)
  console.log(existingGraphs, "AYYY")
  console.log(props.Texts)
  console.log(JSON.parse(props.Layout))

  const layout = JSON.parse(props.Layout)



  const handleClick = () => {
    const newRows = new Map(data);
    newRows.set(`datapoint${[newRows.size + 1]}`, "");
    newRows.set(`datapoint${[newRows.size + 1]}`, "");
    setData(newRows)
  };



  const handleDelete = () => {

    const newRows = new Map(data);

    if (newRows.size === 4) {

      setError2(true)
    }
    else {
      newRows.delete(`datapoint${newRows.size}`);
      newRows.delete(`datapoint${newRows.size}`);
      setData(newRows);
    }
  }


  const handleChange = (datapoint) => (event) => {

    const newRows = new Map(data);

    newRows.set(datapoint, event.target.value);

    setData(newRows)


  }


  const changecolor = _debounce(() => {

    const value = document.getElementById("chartseriescolor").value;


    setColor(value)

  }, 200);


  const changetooltipcolor = _debounce(() => {

    const value = document.getElementById("charttooltipcolor").value;

    settooltipColor(value)

  }, 200)


  const changetooltiptextcolor = _debounce(() => {

    const value = document.getElementById("charttooltiptextcolor").value;

    settooltiptextColor(value)

  }, 200)

  const changeaxiscolor = _debounce(() => {

    const value = document.getElementById("chartaxiscolor").value;

    setaxisColor(value)

  }, 200)


  const changeTextcolor = _debounce(() => {

    const value = document.getElementById("textInputColor").value;

    setTextColor(value)

  }, 200);

  const ChangingSriesTitle = _debounce((e) => {

    if (e.target.value.length > 55) {
      setError(true)
      console.log("too Long 7bb <3")
      setseriesTitle("")
    }
    else {
      console.log(e.target.value)
      setseriesTitle(e.target.value)

    }
  }, 400)


  const recentTrades = (
    <>
      <Modal
        backdrop="static"
        show={show}
        style={{ opacity: 3 }}
        onHide={() => setShow(false)} >

        <Modal.Header>

          <AddCircleSharpIcon onClick={() => {


            setnumberofGraphs(prevLines => (

              [
                ...prevLines,
                {
                  type: type, title: title, seriestitle: seriestitle,
                  legend: legend,
                  xAxis: xAxis,
                  yAxis: yAxis,
                  color: color,
                  tooltipcolor: tooltipcolor,
                  tooltiptextcolor: tooltiptextcolor,
                  axisColor: axisColor,
                  gk: googleSheetKey,
                  gs: googleSheetNumber,
                  gsc: googleSheetStartColumn,
                  gec: googleSheetEndColumn,
                  gsr: googleSheetStartRow,
                  id: type + title + color + xAxis + yAxis,
                  data: [...data],

                }
              ]
            )
            );


            if (window !== "undefined") {

              const clientDb = firebaseClient.firestore();

              clientDb.collection("Users").doc(props.uid)
                .collection("Dashboard")
                .doc(props.dashboard).collection("Graphs").add({
                  type: type, title: title, seriestitle: seriestitle,
                  legend: legend,
                  xAxis: xAxis,
                  yAxis: yAxis,
                  color: color,
                  tooltipcolor: tooltipcolor,
                  tooltiptextcolor: tooltiptextcolor,
                  axisColor: axisColor,
                  gk: googleSheetKey,
                  gs: googleSheetNumber,
                  gsc: googleSheetStartColumn,
                  gec: googleSheetEndColumn,
                  gsr: googleSheetStartRow,
                  id: type + title + color + xAxis + yAxis,
                  data: [...data.values()]
                })


            }


            setShow(false);
            setTitle("");

          }}
            style={{
              color: "#c7c9d3",
              float: "right"
            }} />

          <CloseIcon onClick={() => setShow(false)}
            style={{
              color: "#c7c9d3",
              float: "right"
            }} />

          <input className="inputtitle"
            id="inputtitle"
            type="text"
            value={title}
            placeholder="Chart Title"
            onInput={(e) => {
              if (e.target.value.length > 75) {
                setError(true)
                console.log("too Long 7bb")
                setTitle("")
              }
              else {
                console.log(e.target.value)
                setTitle(e.target.value)


              }
            }} />

        </Modal.Header>



        <Modal.Body>

          <BarChartOutlined onClick={() => setType("column")}
            style={{
              color: "#c7c9d3",
              float: "right"
            }}
          />


          <PieChartOutlined onClick={() =>
            setType("pie")}
            style={{
              color: "#c7c9d3",
              float: "right"
            }}
          />

          <LineChartOutlined onClick={() => setType("line")}
            style={{
              color: "#c7c9d3",
              float: "right"
            }}
          />

          <AreaChartOutlined onClick={() => setType("area")}
            style={{
              color: "#c7c9d3",
              float: "right"
            }} />


          <div className="GraphArea" id="GraphArea">

            <CreateGraph1
              key={[type, title,
                legend, xAxis, yAxis, color,
                tooltipcolor, tooltiptextcolor,
                axisColor, googleSheetKey,
                [...data],
                seriestitle]}
              type={type} title={title} seriestitle={seriestitle}
              legend={legend} xAxis={xAxis}
              yAxis={yAxis}
              color={color}
              tooltipcolor={tooltipcolor}
              tooltiptextcolor={tooltiptextcolor}
              axisColor={axisColor}
              gk={googleSheetKey}
              gs={googleSheetNumber}
              gsc={googleSheetStartColumn}
              gec={googleSheetEndColumn}
              gsr={googleSheetStartRow}
              data={[...data]}
            />

          </div>


          <span className="GraphOptions" onClick={() => { setStyle(true) }}>
            <p>
              Style
            </p>
          </span>

          <span className="GraphOptions1" onClick={() => {
            setShow2(true)
          }}>
            <p>
              Data
            </p>
          </span>


          {style ?

            <div className="GraphCheckboxes">

              <Checkbox
                checked={xAxis}
                onChange={(e) => { setxAxis(e.target.checked) }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <p> xAxis </p>

              <Checkbox
                checked={legend}
                onChange={(e) => {
                  setLegend(e.target.checked)
                }}

                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <p> Legend</p>

              <br />
              <Checkbox
                checked={yAxis}
                onChange={(e) => {
                  setyAxis(e.target.checked)
                }}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <p> yAxis </p>

              <br />
              <br />

              {type !== "pie" ?
                <>

                  <input
                    id="chartseriescolor"
                    type="color"
                    defaultValue={color}
                    style={{ marginTop: "45px" }}
                    title="Series Color"
                    onChange={changecolor}
                  />

                  <p>Color</p>

                  <br />

                  <br />

                  <p>Tooltip</p>

                  <br />

                  <input
                    id="charttooltipcolor"
                    type="color"
                    defaultValue={tooltipcolor}
                    style={{ marginTop: "45px" }}
                    title="Background Color"
                    onChange={changetooltipcolor}
                  />

                  <p>Background Color</p>

                  <br />

                  <input
                    id="charttooltiptextcolor"
                    type="color"
                    defaultValue={tooltiptextcolor}
                    style={{ marginTop: "45px" }}
                    title="Background Color"
                    onChange={changetooltiptextcolor}
                  />

                  <p>Text Color</p>

                  <br />

                  {xAxis || yAxis ?

                    <>
                      <input
                        id="chartaxiscolor"
                        type="color"
                        defaultValue={axisColor}
                        style={{ marginTop: "45px" }}
                        title="Background Color"
                        onChange={changeaxiscolor}
                      />

                      <p>label  Color</p>
                    </>
                    :
                    null

                  }
                </>

                :

                <>
                  <p>Tooltip</p>

                  <br />
                  <input
                    id="charttooltipcolor"
                    type="color"
                    defaultValue={tooltipcolor}
                    style={{ marginTop: "45px" }}
                    title="Tooltip Color"
                    onChange={changetooltipcolor}
                  />

                  <p> Background Color</p>

                  <br />


                  <input
                    id="charttooltiptextcolor"
                    type="color"
                    defaultValue={tooltiptextcolor}
                    style={{ marginTop: "45px" }}
                    title="Background Color"
                    onChange={changetooltiptextcolor}
                  />

                  <p>Text Color</p>


                </>

              }

            </div>

            :
            null
          }

          <Modal
            show={show2}
            style={{ opacity: 3 }}
            onHide={() => setShow2(false)} >

            <Modal.Header bsPrefix="DataBoxheader" >

              {!GoogleSheets ?

                <>
                  <span className="DataBoxheader1" onClick={handleClick}>
                    Add Fields
                  </span>

                  <span className="DataBoxheader2" onClick={handleDelete}>
                    Remove Fields
                  </span>

                  <span className="DataBoxheader3">

                    <span onClick={() => {
                      setGoogleSheets(!GoogleSheets)
                    }}>
                      Connect Google Sheets  </span>

                  </span>

                </>
                :

                <span className="DataBoxheader3">

                  <span onClick={() => {
                    setGoogleSheets(!GoogleSheets)
                  }}>
                    Raw Data  </span>

                </span>
              }

              <CloseIcon onClick={() => setShow2(false)}
                style={{
                  color: "#c7c9d3",
                  float: "right"
                }} />

            </Modal.Header>

            <Modal.Body bsPrefix="DataBoxbody" >
              <span ><p>Series Title</p> </span>
              <input className="inputseriestitle"
                id="inputseriestitle"
                type="text"
                value={seriestitle}
                placeholder="Series Title (Optional)"
                onInput={ChangingSriesTitle} />

              {!GoogleSheets ?

                <div className="DataBoxbody1" >

                  {[...data.keys()].map((datapoint) => {
                    return (
                      <input
                        className="inputboxes"
                        id={datapoint}
                        value={data.get(datapoint)}
                        key={datapoint}
                        onChange={handleChange(datapoint)}
                      />
                    );

                  }

                  )}

                </div>

                :

                <>
                  <div className="DataBoxbody2" >

                    <p>Google Sheet Key</p>
                    <input className="InputGoogleSheetsKey"
                      id="InputGoogleSheetsKey"
                      type="text"
                      value={googleSheetKey}
                      placeholder="Required(*)"
                      onInput={(e) => {
                        setgoogleSheetKey(e.target.value)
                      }} />

                    <p>Sheet Number</p>
                    <input className="InputGoogleSheetNumber"
                      id="InputGoogleSheetNumber"
                      type="text"
                      value={googleSheetNumber}
                      placeholder="Optional"
                      onInput={(e) => {
                        setgoogleSheetNumber(e.target.value)
                      }} />
                    <p>Column Number Start</p>
                    <input className="InputGoogleSheetStartColumn"
                      id="InputGoogleSheetStartColumn"
                      type="text"
                      value={googleSheetStartColumn}
                      placeholder="Optional "
                      onInput={(e) => {
                        setgoogleSheetStartColumn(e.target.value)
                      }} />
                    <p>Column Number End</p>
                    <input className="InputGoogleSheetEndColumn"
                      id="InputGoogleSheetEndColumn"
                      type="text"
                      value={googleSheetEndColumn}
                      placeholder="Optional "
                      onInput={(e) => {
                        setgoogleSheetEndColumn(e.target.value)
                      }} />
                    <p>Row Number Start</p>
                    <input className="InputGoogleSheetStartRow"
                      id="InputGoogleSheetStartRow"
                      type="text"
                      value={googleSheetStartRow}
                      placeholder="Optional "
                      onInput={(e) => {
                        setgoogleSheetStartRow(e.target.value)
                      }} />

                  </div>

                  <div className="DataBoxbody3">


                    <p>1eK264_It9ezV8g1Ah_PROiOiOMkKg3KYszvcNHbjso0 </p>

                    <p>1</p>

                    <p>0</p>
                    <p>1</p>

                    <p>0</p>

                  </div>

                  <div className="DataBoxbody4">
                    <p>Demo Example</p>
                    <span>
                      <a href="https://docs.google.com/spreadsheets/d/1eK264_It9ezV8g1Ah_PROiOiOMkKg3KYszvcNHbjso0/edit#gid=0" target="
       _blank">
                        <Image
                          src="/google-sheets.svg"
                          alt="Google-Sheets"
                          width={75} height={65}
                        />
                      </a>
                    </span>
                  </div>

                </>

              }

            </Modal.Body>

          </Modal>

        </Modal.Body>

      </Modal>

    </>

  );

  const recentText = (
    <>
      <Modal
        show={show3}
        style={{ opacity: 3 }}
        onHide={() => setShow3(false)} >

        <Modal.Header bsPrefix="TextBoxheader" >

          <CloseIcon onClick={() => setShow3(false)}
            style={{ color: "#c7c9d3", float: "right" }}
          />

          <AddCircleSharpIcon onClick={() => {

            if (text == "") {
              console.log("Awkward");
              setShow3(false);
            }

            else {

              setnumberofText(prevLines => (

                [
                  ...prevLines,

                  {
                    text: text, textColor: textColor,
                    bold: bold, italic: italic,
                    underline: underline, justify: justify, textSize: textSize,
                    center: center,
                    id: text + textColor + textSize,

                  }
                ]

              )
              );

              if (window !== "undefined") {

                const clientDb = firebaseClient.firestore();

                clientDb.collection("Users").doc(props.uid)
                  .collection("Dashboard")
                  .doc(props.dashboard).collection("Text").add({
                    text: text,
                    textColor: textColor,
                    bold: bold,
                    italic: italic,
                    underline: underline,
                    justify: justify,
                    center: center,
                    textSize: textSize,
                    id: text + textColor
                  })


              }

              setShow3(false);
              setText("");

            }

          }}
            style={{
              color: "#c7c9d3",
              float: "right"
            }} />

        </Modal.Header>

        <Modal.Body bsPrefix="TextBoxbody" >


          <CreateTextBox text={text} textColor={textColor}
            bold={bold} italic={italic}
            underline={underline} justify={justify} textSize={textSize}
            center={center}
            id={text + textColor + textSize} />

          <input className="textInput"
            id="textInput"
            type="text"
            value={text}
            placeholder="Enter Text Here"
            onInput={(e) => {
              console.log(e.target.value)
              setText(e.target.value)
            }} />

          <div className="textInput2">

            <input
              className="textInputColor"
              id="textInputColor"
              type="color"
              defaultValue={textColor}
              style={{ marginTop: "45px" }}
              title="Text Color"
              onChange={changeTextcolor}
            />

            <p>Text Color</p>


            <FormControl style={{ width: "120px", marginLeft: "35px", marginTop: "35px" }} >
              <InputLabel style={{ color: "white" }} >Text Size</InputLabel>
              <Select
                style={{ color: "white", borderColor: "white" }}
                id="demo-simple-select"
                value={textSize}
                onChange={(e) => {
                  console.log(e.target.value)
                  settextSize(e.target.value)
                }}
              >
                <MenuItem value={0.7}>Small</MenuItem>
                <MenuItem value={1.2}>Medium</MenuItem>
                <MenuItem value={3}>Large</MenuItem>
              </Select>
            </FormControl>

          </div>

          <div className="textInput3">

            <Checkbox
              checked={bold}
              onChange={(e) => { setBold(e.target.checked) }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p> Bold </p>

            <Checkbox
              checked={italic}
              onChange={(e) => { setItalic(e.target.checked) }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p> Italic </p>

            <br />
            <Checkbox
              checked={underline}
              onChange={(e) => { setUnderline(e.target.checked) }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p> Underline </p>

            <Checkbox
              checked={justify}
              onChange={(e) => { setJustify(e.target.checked) }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p> Justify </p>

            <br />
            <Checkbox
              checked={center}
              onChange={(e) => { setCenter(e.target.checked) }}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <p> Center </p>
          </div>
        </Modal.Body>

      </Modal>
    </>
  );


  return (

    <div className="EditPage">

      <div className="gongas" >

        <div className="jojo" >

          <div className="WorkSpace" id="WorkSpace" style={{
            backgroundColor: `${layout.backgroundColor}`,
            width: `${layout.width}px`,
            borderColor: `${layout.borderColor}`,
            height: `${layout.height}px`
          }} >

            {existingGraphs.map((si, k) => (

              <>
                <EditGraph
                  key={si.type + si.title}
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
                  existingGraphs={existingGraphs}
                  setexistingGraphs={setexistingGraphs}
                  id={si.id}
                  docID={props.dashboard}
                  uid={props.uid}
                  k={k}
                  x={si.x}
                  y={si.y}
                  width={si.width}
                  height={si.height}

                />


              </>

            ))
            }

            {existingText.map((si, k) => (

              <>
                <ViewTextBox key={si.text + si.textColor}
                  text={si.text}
                  textColor={si.textColor}
                  bold={si.bold}
                  italic={si.italic}
                  underline={si.underline}
                  justify={si.justify}
                  center={si.center}
                  textSize={si.textSize}
                  id={si.id}
                  existingText={existingText}
                  setexistingText={setexistingText}
                  uid={props.uid}
                  docID={props.dashboard}
                  x={si.x}
                  y={si.y}
                  width={si.width}
                  height={si.height}
                />

              </>

            ))}

            {numberofGraphs.map((si, k) => (

              <>
                <CreateGraph2
                  key={si.type + si.title}
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
                  numberofGraphs={numberofGraphs}
                  setnumberofGraphs={setnumberofGraphs}
                  id={si.id}
                  docID={props.dashboard}
                  uid={props.uid}
                  k={k}

                />


              </>


            ))
            }

            {numberofText.map((si, k) => (

              <>
                <TextBox key={si.text + si.textColor}
                  text={si.text}
                  textColor={si.textColor}
                  bold={si.bold}
                  italic={si.italic}
                  underline={si.underline}
                  justify={si.justify}
                  center={si.center}
                  textSize={si.textSize}
                  id={si.id}
                  numberofText={numberofText}
                  setnumberofText={setnumberofText}
                  uid={props.uid}
                  docID={props.dashboard}
                />

              </>

            ))}


          </div>

        </div>

      </div>


      <div className="designBar" id="designBar">


        <span className="designBar1" >
          Layout
          <AspectRatioIcon onClick={() => {
            const div = document.getElementById("designBar1Options");

            if (div.style.display !== 'none') {
              div.style.display = 'none';
            }
            else {
              div.style.display = 'block';
            }
          }} />

        </span>


        <span id="designBar1Options" >



          <CloseIcon onClick={() => {
            const div = document.getElementById("designBar1Options");
            div.style.display = 'none';
          }} style={{ color: "#c7c9d3", float: "right" }} />

          <br />
          <br />

          <p>Background Color</p>

          <input
            id="backgroundColorWorkSpace"
            type="color"
            defaultValue={layout.backgroundColor}
            style={{ marginLeft: "50px", marginTop: "25px" }}
            title="Background Color"
            onChange={(e) => {
              const background = document.getElementById("WorkSpace")

              background.style.backgroundColor = e.target.value

              if (window !== "undefined") {

                const clientDb = firebaseClient.firestore();

                const backgroundColorRef = clientDb.collection("Users").doc(props.uid)
                  .collection("Dashboard")
                  .doc(props.dashboard);

                backgroundColorRef.update({
                  backgroundColor: e.target.value
                })
              }
            }}
          />

          <br />
          <br />

          <p>Border Color</p>

          <input
            id="borderColorWorkSpace"
            type="color"
            defaultValue={layout.borderColor}
            style={{ marginLeft: "50px", marginTop: "25px" }}
            title="Border Color"
            onChange={(e) => {
              const background = document.getElementById("WorkSpace")

              background.style.borderColor = e.target.value

              if (window !== "undefined") {

                const clientDb = firebaseClient.firestore();

                const borderColorRef = clientDb.collection("Users").doc(props.uid)
                  .collection("Dashboard")
                  .doc(props.dashboard);

                borderColorRef.update({
                  borderColor: e.target.value
                })
              }
            }}
          />

          <br />
          <br />



          <p>Width</p>

          <span>

            <Slider
              min={845}
              max={2500}
              defaultValue={layout.width}
              aria-labelledby="discrete-slider-custom"
              step={100}
              valueLabelDisplay="auto"
              marks={[{ value: 845, label: "Min" }, { value: 1445, label: "Default" }, { value: 2500, label: "Max" }]}
              onChangeCommitted={(e, v) => {

                const background = document.getElementById("WorkSpace")

                background.style.width = `${v}px`


                if (window !== "undefined") {

                  const clientDb = firebaseClient.firestore();

                  const widthref = clientDb.collection("Users").doc(props.uid)
                    .collection("Dashboard")
                    .doc(props.dashboard);

                  widthref.update({
                    width: v
                  })
                }

              }}

            />

          </span>

          <br />
          <br />

          <p>Height</p>

          <span>

            <Slider
              min={750}
              max={3550}
              defaultValue={layout.height}
              aria-labelledby="discrete-slider-custom"
              step={200}
              valueLabelDisplay="auto"
              marks={[{ value: 750, label: "Min" }, { value: 3550, label: "Max" }]}
              onChangeCommitted={(e, v) => {

                const background = document.getElementById("WorkSpace")

                background.style.height = `${v}px`

                if (window !== "undefined") {

                  const clientDb = firebaseClient.firestore();

                  const heightref = clientDb.collection("Users").doc(props.uid)
                    .collection("Dashboard")
                    .doc(props.dashboard);

                  heightref.update({
                    height: v
                  })
                }
              }}

            />

          </span>


        </span>


        <span className="designBar2">
          Charts
          <AddIcon onClick={() => setShow(true)} />

        </span>


        <span className="designBar3">
          <span className="designBar3-tooltip"><p>coming soon!</p> </span>
          Widgets
          <WidgetsIcon onClick={() => console.log("Ayre")} />
        </span>

        <span className="designBar4">
          Text
          <TextFormatIcon onClick={() => setShow3(true)} />
        </span>

      </div>

      {recentTrades}
      {recentText}


      {error ?
        <div className="SignuperrorMessageNotification2">
          <a onClick={() => { setError(false) }} > X </a>
          <h2>Oh snap! Your title dude!</h2>
          <p>
            Title is too Long!! relax and reduce it to less than 75 characters
          </p>

        </ div>
        :

        null

      }

      {error2 ?
        <div className="SignuperrorMessageNotification2">
          <a onClick={() => { setError2(false) }} > X </a>
          <h2>Sorry !</h2>
          <p>
            You need to have a minimum of 4 Fields
          </p>

        </ div>
        :

        null

      }

    </div>


  )
}

export default EditPage