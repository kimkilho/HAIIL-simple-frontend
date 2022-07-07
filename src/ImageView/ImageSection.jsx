import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "../index.css";
import { ImgClass, Blob } from "./imageinfo.tsx"; 
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
  border-bottom: 1px solid #313c4e;  
  display: flex;
`; 
const ClassSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  grid-row: 3;
  grid-column: 1; 
  margin-top: -1px;
  border-right: 1px solid #313c4e;  
`;
const DefaultP = styled.p`
  //color: black;
  color: #afbdd1;
  font-weight: 300;
  width: auto;
  font-size: 15px;
  line-height: 40px; 
`;
const Pver = styled(DefaultP)`
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  line-height: 0px;
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
  useImperativeHandle(ref, () => ({
    applyExistingMasks,
    clearCanvas: () => {
      canvasRef.current.clearCanvas();
    },
    zoomFit: () => {
      canvasRef.current.zoomFit();
    },
  }));

  var canvasRef = React.useRef({});
  const [toolIdx, setToolIdx] = useState(0);
  const [classIdx, setClassIdx] = useState(0);
  const [strokethickness, setStrokeThickness] = useState(5);
  const [threshold, setThreshold] = useState(100);

  var classes = [
    new ImgClass(1, "", "#DB7093"),
    new ImgClass(2, "", "#DEEF73"),
    new ImgClass(3, "", "#719ADD"),
    new ImgClass(4, "", "#FBD2A6"),
    new ImgClass(5, "", "#14594B"),
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
 
  function applyExistingMasks() { 
    if (props.maskObjs != undefined) { 
      for(let mask of props.maskObjs)
      {
        var obj = mask.convertSVG();
        canvasRef.current.addObj(obj);
      }
    } 
  }

  return (
    <Main className="imageSection">
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
        </ImageControl>
        <DrawMenu className="drawMenu">
          <div></div>
          {/* <DefaultP>{toolIdx}</DefaultP> */}
          <DefaultP>&nbsp;&nbsp;Manual&nbsp;Tools&nbsp;&nbsp;</DefaultP>
          {drawManualTools.map((value, i) => (
            <React.Fragment key={i}>
              <DrawButton
                idx={value.idx}
                icon={value.icon}
                CheckedIdx={toolIdx}
                click={setToolIdx.bind(this)}
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
                click={setToolIdx.bind(this)}
              ></DrawButton>
            </React.Fragment>
          ))}
        </DrawMenu>
        <ClassSection>
          <Pver>&nbsp;&nbsp;Classes&nbsp;&nbsp;</Pver>
          {classes.map((value, i) => (
            <React.Fragment key={i}>
              <ClassButton
                classIndex={i}
                classColor={value.classColor}
                click={setClassIdx.bind(this)}
              ></ClassButton>
            </React.Fragment>
          ))}
          {/* <DefaultP>{classIdx}</DefaultP> */}
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
          maskObjs={props.maskObjs}
          ref={canvasRef}
        ></ImageCanvas>
      </Inner>
    </Main>
  );
});

export default ImageSection;