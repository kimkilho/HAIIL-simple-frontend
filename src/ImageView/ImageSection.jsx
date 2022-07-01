import React, { useCallback, useState, useEffect, forwardRef, useImperativeHandle } from "react";
//import "../style/imageSection.css";
import "../index.css";
import ImageInfo, { ImgClass, Blob } from "./imageinfo.tsx";
//import BlobData from "./imageinfo.tsx";
import ClassButton from "./buttons/ClassButton";
import DrawButton from "./buttons/DrawButton";
import ImageCanvas from "./ImageCanvas";
import * as Icons from "./Icons";
import styled from "styled-components";
import Slider from "./buttons/Slider"; 

const Main = styled.main`
  width: 100%;
  height: 60vh;
  background-color: #212936;
  font-family: 'Roboto', sans-serif;
`; 
const Inner = styled.div`
  display: grid;
  grid-template-rows: 40px 40px 1fr;
  grid-template-columns: 35px 1fr;
  grid-gap: 1px;
  border: 1px solid #313c4e; 
  height: 100%;
`;
const ImageControl = styled.div`
  display: flex;
  grid-row: 1;
  grid-column: 1 / span 3;
  border-bottom: 1px solid #313c4e;
`;
const DrawMenu = styled.div`
  grid-row: 2;
  grid-column: 1 / span 3;
`; 
const ClassSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  grid-row: 3;
  grid-column: 1;
`;
const DefaultP = styled.p`
  color: #afbdd1;
  font-weight: 300;
  width: auto;
  font-size: 15px;
  line-height: 40px; 
`;
const Pver = styled(DefaultP)`
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  line-height: 10px;
`;
const Btn = styled.div`
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 2px;
  border: 1px solid #313c4e;
  color: #999;
  background-color: #2b3648;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  &:hover {
    border-color: #1976d2;
    color: #bbb;
  }
  margin: 4px;
`;


const ImageSection = forwardRef((props, ref) => {
//export default function ImageSection({ svgRef, imgRef, imgs, setInfo, labels }) {

  var files;
  ///var svgRef = React.useRef(null);
  //var imgRef = React.useRef(null);
  var canvasRef = React.useRef({});

  useImperativeHandle(ref, () => ({
    applyExistingLabels,
    clearCanvas,
  }));

  function clearCanvas()
  {
    canvasRef.current.clearCanvas(); 
  }

  function applyExistingLabels() {   
    console.log("applyExistingLabels",props.labels); 
    var templabels = [];
    if(props.labels != undefined)
    { 
      props.labels.forEach(label => {

        if(Object.keys(label).length !== 0)  
        {
          console.log("형변환 전",);
          var _label = new Blob(label);
          templabels.push(_label);
          var obj = _label.convertSVG();
          console.log("converted",_label,obj); 
          canvasRef.current.drawingPolygon(obj); 
        }
        else
        {
          console.log("스킵");
        } 
      })
    } 
 
    props.setLabels(templabels);
  }

  // function oldapplyExistingLabels() {  
  //   var classCount = Object.keys(props.labels).length;
  //   console.log("classCount",classCount);
  //   canvasRef.current.clearCanvas();
  //   for (var i = 0; i < classCount; i++) {
  //     var blobs = Object.values(Object.values(props.labels));
  //     console.log(blobs); 

  //     blobs.forEach(blob => {
  //       canvasRef.current.drawingPolygon(blob);
  //     })
  //   }  
  // }
 

  var classes = [
    new ImgClass(1, "", "palevioletred"),
    new ImgClass(2, "", "#DEEF73"),
    new ImgClass(3, "", "#719ADD"),
  ];
  var drawManualTools = [
    {
      idx: 0,
      icon: <Icons.IconArrow />,
    },
    {
      idx: 1,
      icon: <Icons.IconEraser />,
    },
    {
      idx: 2,
      icon: <Icons.IconBrush />,
    },
    {
      idx: 3,
      icon: <Icons.IconPolyline />,
    },
    {
      idx: 4,
      icon: <Icons.IconPolygon />,
    },
  ];
  var drawAssistTools = [
    {
      idx: 5,
      icon: <Icons.IconPredict />,
    },
    {
      idx: 6,
      icon: <Icons.IconPlusMinus />,
    },
  ];

  //const arrclass = new Array();
  //const arrImageInfo = new Array();
  const [toolIdx, setToolIdx] = useState(0);
  const [classIdx, setClassIdx] = useState(0);
  const [strokethickness, setStrokeThickness] = useState(5);
  const [threshold, setThreshold] = useState(100);

  useEffect(() => {
    setToolIdx(0);
    setClassIdx(0);
  }, []);

  useEffect(() => {
    canvasRef.current.changedToolorClass();
  }, [toolIdx, classIdx]);

  useEffect(() => {
    canvasRef.current.applyStrokeThreshold();
  }, [strokethickness, threshold]);

  // function prevImage() {
  //   if (files != null) {
  //     if (curIdx == 0) return;

  //     backupblob(curIdx);
  //     curIdx--;
  //     loadImage(curIdx);
  //     loadblob(curIdx);
  //     //zoomFit();
  //   }
  // }

  // function nextImage() {
  //   if (files != null) {
  //     if (curIdx + 1 == files.length) return;

  //     backupblob(curIdx);
  //     curIdx++;
  //     loadImage(curIdx);
  //     loadblob(curIdx);
  //     //zoomFit();
  //   }
  // }

  function handleLoadfiles(e) {
    if (e.target.files.length > 0) {
      console.log("open file");
      files = e.target.files;

      var cnt = 0;
      for (var file of files) {
        loadImage(file, cnt++);
      }

      //그려진 object들 삭제
      while (props.svgRef.current.firstChild) {
        props.svgRef.current.removeChild(props.svgRef.current.firstChild);
      }
    }
  }

  function loadImage(filepath, cnt) {
    var img = new Image();
    img.src = URL.createObjectURL(filepath);
    img.onload = function () {
      props.svgRef.current.style.width = img.width.toString();
      props.svgRef.current.style.height = img.height.toString();
      URL.revokeObjectURL(img.src);

      // var info = new ImageInfo(filepath.name, img.width, img.height);
      // info.img = img;
      // console.log("imgs",info.img);
      // imgs.push(info);
      // setInfo([...imgs]);
    };

    props.svgRef.current.style.backgroundImage = "url('" + img.src + "')";
    props.svgRef.current.style.backgroundPosition = "center";
    props.svgRef.current.style.backgroundRepeat = "no-repeat";
  }

  // function backupblob(idx, bRemoveOld = false) {
  //   if (bRemoveOld === true) {
  //     while (arrImageInfo.firstChild) {
  //       arrImageInfo.removeChild(arrImageInfo.firstChild);
  //     }
  //   }
  //   for (var v of svgRef.current.children) {
  //     if (v.nodeName != "circle") {
  //       var tags = v.style.tagName.split(",");
  //       var blob = new BlobData(tags[0], tags[1], tags[2], v); //type, strokethickness, classidx, svg data
  //       arrImageInfo[idx].label.blobs.push(blob);
  //     }
  //   }
  //   if (bRemoveOld === false) {
  //     while (svgRef.current.firstChild) {
  //       svgRef.current.removeChild(svgRef.current.firstChild);
  //     }
  //   }
  // }

  // function loadblob(idx) {
  //   for (var v of arrImageInfo[idx].label.blobs) {
  //     svgRef.current.appendChild(v.data);
  //   }
  //   while (arrImageInfo.firstChild) {
  //     arrImageInfo.removeChild(arrImageInfo.firstChild);
  //   }
  // }

  function handleChangeClass(idx) {
    setClassIdx(idx);
    //console.log("change class:" + classIdx);
  }
  function handleChangeTool(idx) {
    setToolIdx(idx);
    //console.log("handleChangeTool:" +toolIdx);
  }
  function handleChangeStroke(thickness) {
    setStrokeThickness(thickness);
    //console.log("handleChangeTool:" + strokethickness);
  }

  return (
    <Main className="imageSection">
      {/* <div className="moduletitle">Human Labeler</div> */}
      <Inner className="inner">
        <ImageControl className="image-control">
          <DefaultP>&nbsp;&nbsp;Thickness&nbsp;:</DefaultP>
          <Slider
            min="1"
            max="100"
            defaultVal={strokethickness}
            setValue={setStrokeThickness}
          ></Slider>
          <DefaultP>{strokethickness}</DefaultP>
          <DefaultP>&nbsp;&nbsp;Threshold&nbsp;:</DefaultP>
          <Slider
            min="1"
            max="255"
            defaultVal={threshold}
            setValue={setThreshold}
          ></Slider>
          <DefaultP>{threshold}</DefaultP>
          {/* <Btn>
            <label className="loadfile" htmlFor="chooseFile">
              UPLOAD
            </label>
            <input 
              type="file"
              id="chooseFile"
              name="chooseFile"
              multiple
              accept="image/*"
              onChange={handleLoadfiles.bind(this)}
            />
          </Btn> */}
        </ImageControl>
        <DrawMenu className="drawMenu">
          <div id="tools" className="d-flex">
            <div></div>
            <DefaultP>{toolIdx}</DefaultP>
            <DefaultP>&nbsp;&nbsp;Manual&nbsp;Tools&nbsp;&nbsp;</DefaultP>
            {drawManualTools.map((value, i) => (
              <React.Fragment key={i}>
                <DrawButton
                  idx={value.idx}
                  icon={value.icon}
                  CheckedIdx={toolIdx}
                  click={handleChangeTool.bind(this)}
                ></DrawButton>
              </React.Fragment>
            ))}
            <DefaultP>&nbsp;&nbsp;AI-Assisted&nbsp;Tools&nbsp;&nbsp;</DefaultP>
            {drawAssistTools.map((value, i) => (
              <React.Fragment key={i}>
                <DrawButton
                  idx={value.idx}
                  icon={value.icon}
                  CheckedIdx={toolIdx}
                  click={handleChangeTool.bind(this)}
                ></DrawButton>
              </React.Fragment>
            ))}
          </div>
        </DrawMenu>
        <ClassSection>
          <Pver>&nbsp;&nbsp;Classes&nbsp;&nbsp;</Pver>
          {classes.map((value, i) => (
            <React.Fragment key={i}>
              <ClassButton
                classIndex={i}
                classColor={value.classColor}
                click={handleChangeClass.bind(this)}
              ></ClassButton>
            </React.Fragment>
          ))}
          <DefaultP>{classIdx}</DefaultP>
        </ClassSection>
        <ImageCanvas
          imgRef={props.imgRef}
          svgRef={props.svgRef}
          imgW={props.imgW}
          imgH={props.imgH}
          toolIdx={toolIdx}
          thickness={strokethickness}
          thireshold={threshold}
          selectedClass={classes.at(classIdx)}
          labels = {props.labels}
          ref={canvasRef}
        ></ImageCanvas>
      </Inner>
    </Main>
  );

});

export default ImageSection;


{
  /* <div className="search">
          <button className="btn btn--small" id="btn-prev">
            Prev
          </button>
          <button className="btn btn--small" id="btn-next">
            Next
          </button>
        </div> */
}
