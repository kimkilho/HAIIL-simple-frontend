import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import styled from "styled-components";
import { IconEraser } from "./Icons";
import eraser from "../svgs/eraser.svg";
import { Blob } from "./imageinfo.tsx";

const OutDiv = styled.div`
  overflow: hidden;
  background-color: #aaa;
  position: relative;
`;
const Div = styled.div`
  transform-origin: 0px 0px;
  //transform: scale(1) translate(0px, 0px);

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
  border: 1px solid green;
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
  font-size: 15px;
  line-height: 40px;
`;

const ImageCanvas = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    changedToolorClass,
    applyStrokeThreshold,
    drawingPolygon,
    clearCanvas,
  }));

  function clearCanvas() {
    while (props.svgRef.current.firstChild) {
      props.svgRef.current.removeChild(props.svgRef.current.firstChild);
    }
    drawingObjs.splice(0, drawingObjs.length);
  }

  function drawingPolygon(obj) { 
    drawingObjs.push(obj);
    props.svgRef.current.appendChild(drawingObjs[drawingObjs.length - 1])
    setDrawingObjs(drawingObjs); 
  }

  // function drawingPolygon(blob) {
  //   var blobs = Object.values(blob);
  //   console.log("drawingPolygon", blobs);

  //   for (var i = 0; i < blobs.length; i++) {
  //     var blob = Object.values(blobs[i]);
  //     for (var j = 0; j < blob.length; j++) {
  //       var pt = blob[j];
  //       //console.log("pt",pt);
  //       if (j == 0) {
  //         startPolyline({ x: pt[0], y: pt[1] });
  //       } else if (j == blob.length - 1) {
  //         addPoint(pt[0], pt[1]);
  //         addPoint(blob[0][0], blob[0][1]);
  //         stopPolyline(pt[0], pt[1]);
  //         drawingObjs[drawingObjs.length - 1].style.strokeWidth = 1;
  //         //drawingObjs[drawingObjs.length - 1].style.strokeDasharray = "";
  //       } else {
  //         addPoint(pt[0], pt[1]);
  //       }
  //     }
  //   }
  // }

  function changedToolorClass() {
    if (isDrawing) {
      setDrawing(false);
      if (props.svgRef.current.lastChild.nodeName == "polyline") {
        drawingObjs.splice(props.svgRef.current.lastChild, 1);
        props.svgRef.current.removeChild(props.svgRef.current.lastChild);
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
    //console.log("수정전");
    if (isDrawing) {
      //var poly = ;
      //poly.setAttribute("strokeWidth",props.thickness*2);
      //props.svgRef.current.lastChild.style.styokesetAttribute("stroke-width",props.thickness*2);
      //props.svgRef.current.lastChild.style.strokeWidth = props.thickness*2;
      if (drawingObjs[drawingObjs.length - 1].nodeName == "polygon")
        drawingObjs[drawingObjs.length - 1].style.strokeWidth = props.thickness;
      setDrawingObjs(drawingObjs);
    }
  }
  const refBorder = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 }); //current cursor position(relative to image)
  const [circleCursor, setCircleCursor] = useState(
    document.createElementNS("http://www.w3.org/2000/svg", "circle")
  );
  const [lineCursor, setLineCursor] = useState(
    document.createElementNS("http://www.w3.org/2000/svg", "line")
  );
  const [scale, setScale] = useState(1);
  const [isPanning, setPanning] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 }); //마우스 클릭이 되었을 때 당시의 위치
  const [isDrawing, setDrawing] = useState(false); //IsDrawing
  const [drawingObjs, setDrawingObjs] = useState([]); 
  const [currentCursor, setCurrentCursor] = useState("defualt");
  //const [labels, setLabels] = useState([]);

  var lock = false;

  //let polyline; //current drawing object(brush or polygon)
  useEffect(() => {
    setTransform();
    circleCursor.style.strokeWidth = 1 / scale;
  }, [scale]);

  useEffect(() => {
    setTransform();
  }, [point]);

  useEffect(() => {
    console.log("useEffect");
  }, [drawingObjs]); 

  function zoomIn() {
    setScale(scale * 1.1);
    setPanStart({
      x: 0,
      y: 0,
    });
    //setTransform();
  }

  function zoomOut() {
    setScale(scale / 1.1);
    setPanStart({
      x: 0,
      y: 0,
    });
    //setTransform();
  }

  function reset() {
    var s = defaultScale();
    console.log("defaultscale", s);
    setPoint({
      x: defaultPointX(),
      y: defaultPointY(),
    });
    setPanStart({
      x: 0,
      y: 0,
    });
    lock = true;
    setScale(s);
  }

  function zoomFit() {
    //props.imgRef.current.style.transform = null;
    reset();
  }

  function defaultScale() {
    if (props.imgW != null) {
      let _w = props.imgW;
      let _h = props.imgH;

      //var maxSize = props.imgW > props.imgH ? props.imgW : props.imgH;
      //let maxSize = _w > _h ? _w : _h;
      var style =
        props.imgRef.current.currentStyle ||
        window.getComputedStyle(props.imgRef.current, false);
      //props.imgRef
      // refBorder
      var w = parseInt(style.width.replace("px", ""));
      var h = parseInt(style.height.replace("px", ""));
      let wRatio = w / _w;
      let hRatio = h / _h;
      var minRatio = Math.min(wRatio, hRatio);
      var maxRatio = Math.max(wRatio, hRatio);

      console.log("style", w, h, wRatio, hRatio);
      return minRatio; //minDstSize / maxSize;
    } else {
      return 1.0;
    }
  }

  function defaultPointX() {
    console.log("defaultPointX");
    if (props.imgW != null) {
      var realW = props.imgW * scale;
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
  function defaultPointY() {
    console.log("defaultPointY");
    if (props.imgW != null) {
      var realH = props.imgH * scale;
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
    } else {
      //console.log(circleCursor);
    }
  }

  function handleKeyDown(e) {
    //console.log(e);
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
        circleCursor.style.strokeWidth = 1 / scale;
        circleCursor.setAttribute("r", props.thickness / 2);
        circleCursor.style.stroke = props.selectedClass.classColor;
        circleCursor.style.fill = "none";
        props.svgRef.current.appendChild(circleCursor);
        break;
      case 4: //polygon
        circleCursor.style.clientX = e.clientX;
        circleCursor.style.clientY = e.clientY;
        circleCursor.style.strokeWidth = 1 / scale;
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
    //var result = dist / scale;
    //console.log("getRealDis",dist,scale,result);
    return dist;
  }

  function handleMouseDown(e) {
    switch (props.toolIdx) {
      case 0: //pointer
        if (!window.event.shiftKey) {
          return;
        }
        setPanStart({
          x: e.clientX - point.x,
          y: e.clientY - point.y,
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
          var dist = getRealDist(pt, coords);
          if (dist <= 3) {
            console.log("complete");
            stopPolyline(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            drawingObjs[drawingObjs.length - 1].style.stroke = "0";
            circleCursor.style.strokeWidth = 1 / scale;
            circleCursor.style.stroke = props.selectedClass.classColor;
            setCircleCursor(circleCursor);

            //end polyline
            let b = new Blob(
              props.labels.length,
              props.selectedClass.index,
              props.selectedClass.classColor,
              "polyline",
              props.thickness,
              null,
              drawingObjs[drawingObjs.length - 1]
            );
            props.labels.push(b);
            console.log(props.labels);
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
          var dist = getRealDist(pt, coords);
          if (dist < 3) {
            console.log("complete :", pt, coords);
            addPoint(pt.x, pt.y);
            stopPolyline(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            circleCursor.style.strokeWidth = 1 / scale;
            circleCursor.setAttribute("r", 0.5);
            circleCursor.style.stroke = props.selectedClass.classColor;
            drawingObjs[drawingObjs.length - 1].style.strokeWidth = 1;
            setCircleCursor(circleCursor);
            //end polygon

            // this.no = no ?? 0;
            // this.classId = classId ?? 0;
            // this.classColor = classColor ?? "black";
            // this.type = type ?? "polyline";
            // this.thickness = thickness ?? 1;
            // this.data = [];
            console.log("클래스인덱스",props.selectedClass);
            let b = new Blob(
              props.labels.length,
              props.selectedClass.index,
              props.selectedClass.classColor,
              "polygon",
              props.thickness,
              null,
              drawingObjs[drawingObjs.length - 1]
            );
            props.labels.push(b);
            console.log(props.labels);
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
            props.labels.length,
            props.selectedClass.index,
            props.selectedClass.classColor,
            "polyline",
            props.thickness,
            null,
            drawingObjs[drawingObjs.length - 1]
          );
          props.labels.push(b); 
          console.log(props.labels);
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
    setCoords({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });

    switch (props.toolIdx) {
      case 0:
        if (!isPanning) {
          return;
        }
        setPoint({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        setTransform();
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
        circleCursor.setAttribute("cx", coords.x);
        circleCursor.setAttribute("cy", coords.y);
        setCircleCursor(circleCursor);
        break;
      case 3:
        if (isDrawing) {
          let lastIdx = drawingObjs.length - 1;
          var len = drawingObjs[lastIdx].points.length;
          var pt = drawingObjs[lastIdx].points[len - 1];
          if (e.buttons == 1) {
            if (
              pt.x !== e.nativeEvent.offsetX ||
              pt.y !== e.nativeEvent.offsetY
            )
              addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
          // var dist = Math.sqrt(
          //   Math.pow(pt.x - coords.x, 2) + Math.pow(pt.y - coords.y, 2)
          // );
          var dist = getRealDist(pt, coords);
          if (dist <= 5 / scale) {
            circleCursor.style.strokeWidth = 5 / scale;
            circleCursor.style.stroke = "red";
          } else {
            circleCursor.style.strokeWidth = 1 / scale;
            circleCursor.style.stroke = props.selectedClass.classColor;
          }
        }
        circleCursor.setAttribute("cx", coords.x);
        circleCursor.setAttribute("cy", coords.y);
        setCircleCursor(circleCursor);
        break;
      case 4: //polygon
        if (isDrawing) {
          if (e.buttons == 1) {
            addPoint(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
          var pt = drawingObjs[drawingObjs.length - 1].points[0];
          dist = getRealDist(pt, coords);
          if (dist <= 5 / scale) {
            circleCursor.style.strokeWidth = 5 / scale;
            circleCursor.style.stroke = "red";
            circleCursor.setAttribute("r", 5 / scale);
          } else {
            circleCursor.style.strokeWidth = 1 / scale;
            circleCursor.style.stroke = props.selectedClass.classColor;
            circleCursor.setAttribute("r", 0.5);
          }
        }
        circleCursor.setAttribute("cx", coords.x);
        circleCursor.setAttribute("cy", coords.y);
        setCircleCursor(circleCursor);
        break;
    }
  }

  function removeObj(target,index)
  { 
    props.svgRef.current.removeChild(target);
    drawingObjs.splice(target, 1);
    setDrawingObjs(drawingObjs); 
    props.labels.splice(index,1);
  }

  function handleWheel(e) {
    var xs = (e.clientX - point.x) / scale,
      ys = (e.clientY - point.y) / scale,
      delta = e.nativeEvent.wheelDelta
        ? e.nativeEvent.wheelDelta
        : -e.nativeEvent.deltaY;
    delta > 0 ? setScale(scale * 1.2) : setScale(scale / 1.2);

    setPoint({
      x: e.clientX - xs * scale,
      y: e.clientY - ys * scale,
    });
  }
  function handleZoomFit(e) {
    setPoint({
      x: defaultPointX(),
      y: defaultPointY(),
    });
    console.log("handleZoomFit");
    zoomFit();
  }
  function handleZoomIn(e) {
    zoomIn();
  }
  function handleZoomOut(e) {
    zoomOut();
  }

  function setTransform() {
    var val =
      "translate(" + point.x + "px, " + point.y + "px) scale(" + scale + ")";
    props.imgRef.current.style.transform = val;
    console.log(val);
  }

  function newPolyline(_stroke) {
    var poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );

    var stroke = _stroke ? _stroke : 1 / scale;

    poly.style.strokeLinejoin = "round";
    poly.style.strokeWidth = stroke;
    poly.style.strokeOpacity = ".5";

    poly.shapeRendering = "crispEdges;";
    if (_stroke) {
      poly.style.fill = "none";
      poly.style.tagName = props.labels.length.toString();
        //"Brush," + stroke * 2 + "," + props.selectedClass.index;
    } else {
      poly.style.fill = props.selectedClass.classColor;
      poly.style.tagName = props.labels.length.toString();
        //"Polygon," + stroke * 2 + "," + props.selectedClass.index; 
    }
    poly.style.strokeLinecap = "round";
    poly.style.stroke = props.selectedClass.classColor;
    poly.style.fillOpacity = ".3";

    console.log("sef",poly.style.tagName);
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
    var points = poly.getAttribute("points");
    var val = `${_x},${_y} `;
    if (points === null) points = val;
    else points += val;

    poly.setAttributeNS(null, "points", points);

    //setDrawingObjs({...drawingObjs, });
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
      >
        <Svg
          className="imageView"
          ref={props.svgRef}
          cursor={currentCursor}
        ></Svg>
      </Div>
      <BtmDiv>
        <DefaultP>
          (x:{coords.x} y:{coords.y}), {(scale * 100).toFixed(0)}%
        </DefaultP>
        <DefaultP>&nbsp;&nbsp;&nbsp;label : {props.labels.length}</DefaultP>
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
