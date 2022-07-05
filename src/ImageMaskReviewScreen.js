import { useState, useEffect, useRef } from 'react';
import ImageSection from "../src/ImageView/ImageSection"
import styled from "styled-components";
import { Blob } from "./ImageView/imageinfo.tsx";

const MainDiv = styled.div` 
  //background-color: #212936; 
`; 

const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top); 

  return [x, y];
};
 
const MASK_COLORS = ['#DB7093','#DEEF73','#719ADD','#FBD2A6','#14594B']; 

function ImageMaskReviewScreen(props) {
  var imgSectionRef = useRef({});
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const [classesObj, setClassesObj] = useState({});    // { <int>: <string>, ... }
  const [classButtonItems, setClassButtonItems] = useState([]);
  const [selectedClassIdx, setSelectedClassIdx] = useState(-1);    // int
  const [drawPolygonWithPoints, setDrawPolygonWithPoints] = useState(false);    // bool
  const [pointsObj, setPointsObj] = useState({});
  const [maskObjs, setMaskObjs] = useState([]);
  const [imgSize, setImgSize] = useState({width:0, height:0});
  
  // { <int>: [ (#: numPoints) [<int>, <int>], ... ], ... }
  //const [maskObj, setMaskObj] = useState({});
    /*
      {
        <int>:
          [  (# elements: numPolygons)
            [  (# elements: numPoints)
              [<int>, <int>], ...
            ], ...
          ], ...
      }
     */
  //const [predMaskObj, setPredMaskObj] = useState({});
  /*
    {
      <int>:
        [  (# elements: numPolygons)
          [  (# elements: numPoints)
            [<int>, <int>], ...
          ], ...
        ], ...
    }
   */

    const drawPointForClass = (ctx, color, point) => {
      ctx.fillStyle = color;
      const [x, y] = point;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2*Math.PI, true);
      ctx.fill();
    };
  
    const drawPolygonForClass = (ctx, color, coords, fill = true) => {
      ctx.beginPath();
      for (let i = 0; i < coords.length; i++) {
        const [x, y] = coords[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      if (fill === true) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.setLineDash([5]);
        ctx.stroke();
      }
    };

    // const addPointForClassBeingReviewed = ({nativeEvent}) => {
    //   const canvas = canvasRef.current;
  
    //   if (selectedClassIdx <= 0) {
    //     return;
    //   }
  
    //   const coord = getCursorPosition(canvas, nativeEvent);
    //   setPointsObj({
    //     ...pointsObj,
    //     [selectedClassIdx]: [ ...pointsObj[selectedClassIdx], coord ],
    //   });
    // };

  const handleSubmitButtonOnClick = () => {
    const { id, name, domain, classes } = props.selectedDatasetObj;
    const imageFilename = props.selectedImageInfoObj.imageFilename;
    // props.createAndSetMask(id, name, domain, imageFilename, maskObj);

    props.createAndSetMask(
      id,
      name,
      domain,
      imageFilename,
      { maskObjs } /*maskObj*/
    );
  };

  const handleClassButtonItemOnClick = (classIdx, prevClassIdx) => {
    if (parseInt(classIdx) === 0 && prevClassIdx > 0) {
      setDrawPolygonWithPoints(true);
    }

    setSelectedClassIdx(classIdx);
  }

  useEffect(() => {
    // Create class buttons to draw mask only for positive classes (except "OK", "normal", ...)
    if (props.selectedDatasetObj !== null) {
      const tempClassesObj = {};
      // Put 'empty' class (to make it as a button for exiting the drawing mode)
      tempClassesObj[0] = '(release)';

      for (let classIdx in props.selectedDatasetObj.classes) {
        if (props.selectedDatasetObj.classes[classIdx] === 'OK' ||
          props.selectedDatasetObj.classes[classIdx] === 'normal')
          continue
        if (classIdx > 0) {
          tempClassesObj[parseInt(classIdx)] = props.selectedDatasetObj.classes[classIdx];
        }
      }
      setClassesObj(tempClassesObj);
    }
  }, [props.selectedDatasetObj]);

  useEffect(() => {
    if (Object.keys(classesObj).length > 0) {
      const numGridsPerClass = Math.round(12 / Object.keys(classesObj).length);
      const tempClassButtonItems = [];
      for (let classIdx in classesObj) {
        const classButtonClassNamePostfix = selectedClassIdx === classIdx ? 'btn-secondary text-white' : '';
        const classButtonItem =
          <button key={classIdx} type="button"
                  className={`col-sm-${numGridsPerClass} btn btn-lg btn-outline-secondary ${classButtonClassNamePostfix}`}
                  onClick={() => handleClassButtonItemOnClick(classIdx, selectedClassIdx)}
          >
            { classesObj[classIdx] }
          </button>;
        tempClassButtonItems.push(classButtonItem);
      }
      setClassButtonItems(tempClassButtonItems);
    }
  }, [classesObj, selectedClassIdx])

  useEffect(() => {
    const svg = svgRef.current; 
    // Load image on canvas (when a new image is selected for review)
    if (
      props.selectedImageInfoObj.imageBlob !== null 
      // && Object.keys(classesObj).length > 0
    ) {
      console.log("Load a new image");
      const imageURL = URL.createObjectURL(
        props.selectedImageInfoObj.imageBlob
      );
      const image = new Image();
      image.onload = () => {
        svg.style.width = image.width.toString();
        svg.style.height = image.height.toString();

        setImgSize({ width: image.width, height: image.height });

        svg.style.backgroundImage = "url('" + image.src + "')";
        svg.style.backgroundRepeat = "no-repeat";
        imgSectionRef.current.zoomFit();
        imgSectionRef.current.clearCanvas();

        // Initialize temp objects for maskObj
        const tempMaskObjs = [];
        //Load existing mask and draw (if any) and put its data into maskObj
        console.log("Draw existing mask (if any)");
        const existingMask = props.selectedImageInfoObj.mask;
        if (existingMask.maskObjs !== undefined) {
          var maskObjs = Object.values(existingMask.maskObjs);
          for (let mask of maskObjs) {
            tempMaskObjs.push(new Blob(mask));
          }
        }

        const existingPredMask = props.selectedImageInfoObj.predMask;
        console.log("Draw existing predMask (if any)", existingPredMask);
        for (let classIdx in existingPredMask) {
          const polygons = existingPredMask[classIdx];
          for (let polygon of polygons) {
            // Draw polygons using the points from the existing mask
            let b = new Blob(
              tempMaskObjs.length,
              classIdx - 1,
              MASK_COLORS[classIdx - 1],
              "predict",
              1,
              polygon,
              null
            );
            tempMaskObjs.push(b);
          }
        }

        setMaskObjs(tempMaskObjs);
        console.log("load masks:",tempMaskObjs);
        imgSectionRef.current.applyExistingMasks();

        URL.revokeObjectURL(imageURL);
      };
      image.src = imageURL;
    }

  }, [props.selectedImageInfoObj.imageId, props.selectedImageInfoObj.segNetId]);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');

    // // Draw points on canvas (if any)
    // if (selectedClassIdx > 0 && pointsObj[selectedClassIdx].length > 0) {
    //   const pointsForClassBeingReviewed = pointsObj[selectedClassIdx];
    //   drawPointForClass(context, MASK_COLORS[selectedClassIdx-1],
    //     pointsForClassBeingReviewed[pointsForClassBeingReviewed.length-1]);
    // }

    // // Draw a polygon on canvas (only for the classes that are ready to draw)
    // if (drawPolygonWithPoints === true) {
    //   for (let classIdx in pointsObj) {
    //     if (pointsObj[classIdx].length > 0) {
    //       // Draw polygons using the points
    //       drawPolygonForClass(context, MASK_COLORS[classIdx-1], pointsObj[classIdx]);

    //       // Save drawn polygon as mask data
    //       const maskClass = maskObj[classIdx];
    //       maskClass.push(pointsObj[classIdx]);
    //       setMaskObj({ ...maskObj, [classIdx]: maskClass });

    //       // Clear the points
    //       setPointsObj({ ...pointsObj, [classIdx]: [] });
    //     }
    //   }
    //   setDrawPolygonWithPoints(false);
    // }
  }, [pointsObj, drawPolygonWithPoints]);

  return (
    <MainDiv className="col-sm-6 px-md-4 align-items-center">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h4">Review Screen</h1>
      </div>
      <div className="d-flex justify-content-between">
        <h2 className="h5">{props.selectedImageInfoObj.imageFilename}</h2>
        <h2 className="h5">0.999</h2>
      </div> 

      <div className="d-flex align-items-center">
        <ImageSection
          imgRef={imgRef}
          svgRef={svgRef}
          maskObjs={maskObjs}
          ref={imgSectionRef}
          imgW={imgSize.width}
          imgH={imgSize.height}
          setMaskObjs={setMaskObjs}
        ></ImageSection>
        {/* <canvas
          className="mx-auto border"
          id="imageCanvas"
          width="512"
          height="512"
          ref={canvasRef}
          onClick={addPointForClassBeingReviewed}
        /> */}
      </div>
      {/* <div className="d-flex btn-toolbar align-items-center mt-1">
        {classButtonItems}
      </div> */}
      <div className="d-flex btn-toolbar align-items-center mt-1">
        <button
          type="button"
          className="col-sm-12 btn btn-lg btn-outline-primary"
          onClick={handleSubmitButtonOnClick}
        >
          SUBMIT
        </button>
      </div> 
    </MainDiv>
  );
}

export default ImageMaskReviewScreen;