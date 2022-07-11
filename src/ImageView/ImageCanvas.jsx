import React, {
  forwardRef, 
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import styled from "styled-components"; 
import eraser from "../svgs/eraser.svg";
import { Blob } from "./imageinfo.tsx";

const OutDiv = styled.div`
  overflow: hidden;
  background-color: #aaa;
  position: relative;
`;
const Div = styled.div`
  transform-origin: 0px 0px; 
  position: absolute;
  display: block;
  width: 100%;
  height: calc(100% - 30px);
  outline: none;
`;
const BtmDiv = styled.div`
  width: 100%;
  height: 30px;
  background-color: #313c4e; 
  position: absolute;
  bottom: 0px; 
  display: flex;
  justify-content: flex-end;
`;
const Svg = styled.svg`
  position: absolute;
  image-rendering: pixelated;
  &:hover {
    cursor: ${(props) => props.cursor};
  }
  outline: none;
`;
const Btn = styled.button`
  width: 28px;
  height: 28px;
  bottom: 4px;
  text-indent: -4px;
  font-size: 22px;
  //cursor: pointer;
  transition: background-color 0.4s;
  border-radius: 2px;
  border: 1px solid #313c4e;
  color: #c4c4c4;
  background-color: #2b3648;
  margin: 1px;
  &:hover {
    border-color: #1976d2;
    color: #bbb;
  }
`;
const DefaultP = styled.p`
  color: #afbdd1; 
  font-weight: 300;
  width: auto;
  font-size: 14px;
  line-height: 30px;
`;

const ImageCanvas = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    changedToolorClass,
    applyStrokeThreshold,
    addObj,
    clearCanvas,
    zoomFit,
  }));

  const refBorder = useRef(null);
  const [coord, setCoord] = useState({ x: 0, y: 0 }); //current cursor position(relative to image)
  const [circleCursor, setCircleCursor] = useState(
    document.createElementNS("http://www.w3.org/2000/svg", "circle")
  );
  const [lineCursor, setLineCursor] = useState(
    document.createElementNS("http://www.w3.org/2000/svg", "line")
  );
  const [isPanning, setPanning] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale:1 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 }); // position when the mouse clicked for panning.
  const [isDrawing, setDrawing] = useState(false); //IsDrawing
  const [drawingObjs, setDrawingObjs] = useState([]);
  const [currentCursor, setCurrentCursor] = useState("defualt"); 

  useEffect(()=> {
    //console.log("setTransform",transform);
    applyTransform();
  },[transform]) 

  useEffect(()=> { 
    circleCursor.setAttribute("cx", coord.x);
    circleCursor.setAttribute("cy", coord.y);
    setCircleCursor(circleCursor);
  },[coord]) 
 
  function clearCanvas() {
    setDrawing(false);
    while (props.svgRef.current.firstChild) {
      props.svgRef.current.removeChild(props.svgRef.current.firstChild);
    }
    drawingObjs.splice(0, drawingObjs.length);
  }

  function addObj(obj) {
    drawingObjs.push(obj);
    props.svgRef.current.appendChild(drawingObjs[drawingObjs.length - 1]);
    setDrawingObjs(drawingObjs);
  }
 
  function changedToolorClass() {
    if (isDrawing) {
      setDrawing(false);
      if(props.svgRef.current.lastChild !== null)
      { 
        if (props.svgRef.current.lastChild.nodeName === "polyline") {
          drawingObjs.splice(props.svgRef.current.lastChild, 1);
          props.svgRef.current.removeChild(props.svgRef.current.lastChild);
        }
      }
    }
    switch (props.toolIdx) {
      case 0: //none
        setCurrentCursor("default");
        break;
      case 1: //eraser
        setCurrentCursor(`url(${eraser}), auto`);
        break;
      case 2: //brush
        setCurrentCursor("default");
        break;
      case 3: //polyline
        setCurrentCursor("default");
        break;
      case 4: //polygon
        setCurrentCursor("crosshair");
        break;
      case 5: //predict
        setCurrentCursor("crosshair");
        break;
      case 6: //plusminus
        setCurrentCursor("crosshair");
        break;
    }
  }

  function applyStrokeThreshold() { 
    if (isDrawing) { 
      if (drawingObjs[drawingObjs.length - 1].nodeName == "polygon")
        drawingObjs[drawingObjs.length - 1].style.strokeWidth = props.thickness;
      setDrawingObjs(drawingObjs);
    }
  }

 

  function zoomIn() {
    setTransform({ ...transform, scale: transform.scale * 1.1 });
    setPanStart({
      x: 0,
      y: 0,
    });
  }

  function zoomOut() {
    setTransform({ ...transform, scale: transform.scale / 1.1 });
    setPanStart({
      x: 0,
      y: 0,
    });
  }

  function reset() {
    let _scale = defaultScale();
    let _x = defaultPointX(_scale);
    let _y = defaultPointY(_scale);
    setTransform({ x: _x, y: _y, scale: _scale }); 
    setPanStart({
      x: 0,
      y: 0,
    });
  }

  function zoomFit() { 
    reset();
  }

  function defaultScale() {
    if (props.imgW != null) {
      let _w = props.imgW;
      let _h = props.imgH;
 
      var style =
        props.imgRef.current.currentStyle ||
        window.getComputedStyle(props.imgRef.current, false); 

      var w = parseInt(style.width.replace("px", ""));
      var h = parseInt(style.height.replace("px", ""));
      let wRatio = w / _w;
      let hRatio = h / _h;
      var minRatio = Math.min(wRatio, hRatio);
      var maxRatio = Math.max(wRatio, hRatio);

      //console.log("style", w, h, wRatio, hRatio);
      return minRatio; //minDstSize / maxSize;
    } else {
      return 1.0;
    }
  }

  function defaultPointX(_scale) {
    if (props.imgW != null) {
      var realW = props.imgW * _scale;
      var style =
        props.imgRef.current.currentStyle ||
        window.getComputedStyle(props.imgRef.current, false);
      var w = parseInt(style.width.replace("px", ""));
      var offset = w - realW;
 
      return offset / 2;
    } else {
      return 0;
    }
  }
  function defaultPointY(_scale) {
    if (props.imgW != null) {
      var realH = props.imgH * _scale;
      var style =
        props.imgRef.current.currentStyle ||
        window.getComputedStyle(props.imgRef.current, false);
      var h = parseInt(style.height.replace("px", ""));
      var offset = h - realH;

      return offset / 2;
    } else {
      return 0;
    }
  }

  function handleMouseLeave(e) {
    setPanning(false);
    if (props.svgRef.current.contains(circleCursor)) {
      props.svgRef.current.removeChild(circleCursor);
    }
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case "Enter":
        if (isDrawing) {
          drawingDone();
        }
        break;
    }
  }

  function drawingDone() {
    if (props.toolIdx == 3 /*polyline*/) {
      console.log("polyline complete");
      stopPolyline(coord.x, coord.y);
      circleCursor.style.strokeWidth = 1 / transform.scale;
      circleCursor.style.stroke = props.selectedClass.classColor;
      setCircleCursor(circleCursor);

      //end polyline
      let b = new Blob(
        props.maskObjs.length,
        props.selectedClass.index,
        props.selectedClass.classColor,
        "polyline",
        props.thickness,
        null,
        drawingObjs[drawingObjs.length - 1]
      );
      props.maskObjs.push(b);
    } else if (props.toolIdx == 4 /*polygon*/) {
      console.log("polygon complete");
      var pt = drawingObjs[drawingObjs.length - 1].points[0];
      addPoint(pt.x, pt.y);
      stopPolyline();
      circleCursor.style.strokeWidth = 1 / transform.scale;
      circleCursor.setAttribute("r", 0.5);
      circleCursor.style.stroke = props.selectedClass.classColor;
      drawingObjs[drawingObjs.length - 1].style.strokeWidth = 1;
      setCircleCursor(circleCursor);
 
      let b = new Blob(
        props.maskObjs.length,
        props.selectedClass.index,
        props.selectedClass.classColor,
        "polygon",
        props.thickness,
        null,
        drawingObjs[drawingObjs.length - 1]
      );
      props.maskObjs.push(b);
      console.log(props.maskObjs);
    }
  }

  function handleMouseEnter(e) {
    switch (props.toolIdx) {
      case 0: //none
        break;
      case 1: //eraser
        break;
      case 2: //brush
      case 3: //polyline
        circleCursor.style.clientX = e.clientX;
        circleCursor.style.clientY = e.clientY;
        circleCursor.style.strokeWidth = 1 / transform.scale;
        circleCursor.setAttribute("r", props.thickness / 2);
        circleCursor.style.stroke = props.selectedClass.classColor;
        circleCursor.style.fill = "none";
        props.svgRef.current.appendChild(circleCursor);
        break;
      case 4: //polygon
        circleCursor.style.clientX = e.clientX;
        circleCursor.style.clientY = e.clientY;
        circleCursor.style.strokeWidth = 1 / transform.scale;
        circleCursor.setAttribute("r", 0.5);
        circleCursor.style.stroke = props.selectedClass.classColor;
        circleCursor.style.fill = "none";
        props.svgRef.current.appendChild(circleCursor);
        break;
      case 5: //predict
        break;
      case 6: //plusminus
        break;
    }
  }

  function getRealDist(pt, pt2) {
    var dist = Math.sqrt(Math.pow(pt.x - pt2.x, 2) + Math.pow(pt.y - pt2.y, 2)); 
    return dist;
  }

  function handleMouseDown(e) {
    switch (props.toolIdx) {
      case 0: //pointer
        if (!window.event.shiftKey) {
          return;
        }
        setPanStart({
          x: e.clientX - transform.x,
          y: e.clientY - transform.y,
        });
        setPanning(true);
        break;
      case 1: //eraser
        if (e.target.nodeName === "polyline") {
          removeObj(e.target, drawingObjs.indexOf(e.target));
        }
        break;
      case 2: //brush
        startPolyline(
          { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
          props.thickness
        );
        break;
      case 3: //polyline
        if (!isDrawing)
          startPolyline(
            { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
            props.thickness
          );
        else {
          var len = drawingObjs[drawingObjs.length - 1].points.length;
          var pt = drawingObjs[drawingObjs.length - 1].points[len - 1];
          var dist = getRealDist(pt, coord);
          if (dist <= 5) {
            drawingDone();
          } else {
            addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
        }
        break;
      case 4: //polygon
        if (!isDrawing)
          startPolyline({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        else {
          var pt = drawingObjs[drawingObjs.length - 1].points[0];
          var dist = getRealDist(pt, coord);
          if (dist <= 5) {
            drawingDone();
          } else {
            addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
        }
        break;
    }
  }
  function handleMouseUp(e) {
    setPanning(false);
    switch (props.toolIdx) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        if (isDrawing) {
          stopPolyline(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

          //end brush
          let b = new Blob(
            props.maskObjs.length,
            props.selectedClass.index,
            props.selectedClass.classColor,
            "polyline",
            props.thickness,
            null,
            drawingObjs[drawingObjs.length - 1]
          );
          props.maskObjs.push(b);
          console.log(props.maskObjs);
        }
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
    }
  }
  function handleMouseMove(e) {
    setCoord({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });

    switch (props.toolIdx) {
      case 0:
        if (!isPanning) {
          return;
        }
        setTransform({
          ...transform,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        applyTransform();
        break;
      case 1:
      case 1: //eraser
        if (e.buttons == 1) {
          if (e.target.nodeName === "polyline") {
            removeObj(e.target, drawingObjs.indexOf(e.target));
          }
        }
        break;
      case 2:
        if (isDrawing) {
          addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        } 
        setCircleCursor(circleCursor);
        break;
      case 3:
        if (isDrawing) {
          let lastIdx = drawingObjs.length - 1;
          var len = drawingObjs[lastIdx].points.length;
          var pt = drawingObjs[lastIdx].points[len - 1];
          if (e.buttons == 1) {
              addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
          var dist = getRealDist(pt, coord);
          if (dist <= 5 / transform.scale) {
            circleCursor.style.strokeWidth = 5 / transform.scale;
            circleCursor.style.stroke = "red";
          } else {
            circleCursor.style.strokeWidth = 1 / transform.scale;
            circleCursor.style.stroke = props.selectedClass.classColor;
          }
        } 
        setCircleCursor(circleCursor);
        break;
      case 4: //polygon
        if (isDrawing) {
          if (e.buttons == 1) {
            addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
          var pt = drawingObjs[drawingObjs.length - 1].points[0];
          dist = getRealDist(pt, coord);
          if (dist <= 5 / transform.scale) {
            circleCursor.style.strokeWidth = 5 / transform.scale;
            circleCursor.style.stroke = "red";
            circleCursor.setAttribute("r", 5 / transform.scale);
          } else {
            circleCursor.style.strokeWidth = 1 / transform.scale;
            circleCursor.style.stroke = props.selectedClass.classColor;
            circleCursor.setAttribute("r", 0.5);
          }
        } 
        setCircleCursor(circleCursor);
        break;
    }
  }

  function removeObj(target, index) {
    props.svgRef.current.removeChild(target);
    drawingObjs.splice(target, 1);
    setDrawingObjs(drawingObjs);
    props.maskObjs.splice(index, 1);
  }

  function handleWheel(e) {
    var xs = (e.clientX - transform.x) / transform.scale,
      ys = (e.clientY - transform.y) / transform.scale,
      delta = e.nativeEvent.wheelDelta
        ? e.nativeEvent.wheelDelta
        : -e.nativeEvent.deltaY;

    let _scale =  delta > 0 ? transform.scale * 1.2 : transform.scale / 1.2;  
    setTransform({
      x: e.clientX - xs * _scale,
      y: e.clientY - ys * _scale,
      scale: _scale,
    });
  }

  function handleZoomFit() {
    zoomFit();
  }
  function handleZoomIn() {
    zoomIn();
  }
  function handleZoomOut() {
    zoomOut();
  }

  function applyTransform() {
    var val =
      "translate(" + transform.x + "px, " + transform.y + "px) scale(" + transform.scale + ")";
    props.imgRef.current.style.transform = val;
    //console.log(val);
  }

  function newPolyline(_stroke) {
    var poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );

    var stroke = _stroke ? _stroke : 1 / transform.scale;

    poly.style.strokeLinejoin = "round";
    poly.style.strokeWidth = stroke;
    poly.style.strokeOpacity = ".5";  
    if (_stroke) {
      poly.style.strokeOpacity = "0.5";
      poly.style.fill = "none"; 
    } else {
      poly.style.strokeOpacity = "1";
      poly.style.fill = props.selectedClass.classColor; 
    }
    poly.style.strokeLinecap = "round";
    poly.style.stroke = props.selectedClass.classColor;
    poly.style.fillOpacity = ".3";

    return poly;
  }

  function startPolyline(pt, stroke) {
    setDrawing(true);
    drawingObjs.push(newPolyline(stroke));
    setDrawingObjs(drawingObjs);
    addPoint(pt.x, pt.y);
    props.svgRef.current.appendChild(drawingObjs[drawingObjs.length - 1]);
  }

  function stopPolyline(_x, _y) {
    if (
      drawingObjs[drawingObjs.length - 1].points.length == 1 &&
      (props.toolIdx == 2 || props.toolIdx == 3)
    ) {
      addPoint(_x, _y);
    }
    setDrawing(false);
  }

  function addPoint(_x, _y) {
    var poly = drawingObjs[drawingObjs.length - 1];
    if(poly.points.length > 0)
    { 
      let pt = poly.points[poly.points.length-1]; 
      if (pt.x === _x && pt.y === _y)
        return;
    }

    var points = poly.getAttribute("points");
    var val = `${_x},${_y} `;
    if (points === null) points = val;
    else points += val; 
    poly.setAttributeNS(null, "points", points); 
  }

  return (
    <OutDiv ref={refBorder}>
      <Div
        onMouseLeave={handleMouseLeave.bind(this)}
        onMouseDown={handleMouseDown.bind(this)}
        onMouseUp={handleMouseUp.bind(this)}
        onMouseMove={handleMouseMove.bind(this)}
        onWheel={handleWheel.bind(this)}
        onMouseEnter={handleMouseEnter.bind(this)}
        onKeyDown={handleKeyDown.bind(this)}
        ref={props.imgRef}
        tabIndex="0"
        onTouchStart={handleMouseDown.bind(this)}
        onTouchEnd={handleMouseLeave.bind(this)}
        onTouchMove={handleMouseMove.bind(this)}
      >
        <Svg
          className="imageView"
          ref={props.svgRef}
          cursor={currentCursor}
        ></Svg>
      </Div>
      <BtmDiv>
        <DefaultP>
          (x:{coord.x} y:{coord.y}) Scale : {(transform.scale * 100).toFixed(0)}
          %
        </DefaultP>
        <DefaultP>
          &nbsp;&nbsp;&nbsp;masks : {props.maskObjs.length}
        </DefaultP>
        <Btn
          className="zoom zoom-plus material-icons"
          id="zoom-plus"
          onClick={handleZoomIn.bind(this)}
        >
          zoom_in
        </Btn>
        <Btn
          className="zoom zoom-minus material-icons"
          id="zoom-minus"
          onClick={handleZoomOut.bind(this)}
        >
          zoom_out
        </Btn>
        <Btn
          className="zoom zoom-fit material-icons"
          id="zoom-fit"
          onClick={handleZoomFit.bind(this)}
        >
          fit_screen
        </Btn>
      </BtmDiv>
    </OutDiv>
  );
});

export default ImageCanvas;
