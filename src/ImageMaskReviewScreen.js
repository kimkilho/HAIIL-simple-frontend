import { useState, useEffect, useRef } from 'react';
import ImageSection from "../src/ImageView/ImageSection"
import styled from "styled-components";

const MainDiv = styled.div` 
  //background-color: #212936; 
`; 

const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return [x, y];
};

const COLORS = ['rgba(255, 0, 0, 0.3)', 'rgba(255, 127, 0, 0.3)', 'rgba(0, 255, 127, 0.3)']

function ImageMaskReviewScreen(props) {
  var imgSectionref = useRef({});
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const [classesObj, setClassesObj] = useState({});    // { <int>: <string>, ... }
  const [classButtonItems, setClassButtonItems] = useState([]);
  const [classBeingReviewedIdx, setClassBeingReviewedIdx] = useState(-1);    // int
  const [drawPolygonWithPoints, setDrawPolygonWithPoints] = useState(false);    // bool
  const [pointsObj, setPointsObj] = useState({});
  const [labels, setLabels] = useState([]);
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

  const drawPointForClass = (ctx, classIdx, point) => {
    ctx.fillStyle = COLORS[classIdx-1];
    const [x, y] = point;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2*Math.PI, true);
    ctx.fill();
  };

  const drawPolygonForClass = (ctx, classIdx, coords) => {
    ctx.fillStyle = COLORS[classIdx-1];
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
    ctx.fill();
  };

  // const addPointForClassBeingReviewed = ({nativeEvent}) => {
  //   const canvas = canvasRef.current;

  //   if (classBeingReviewedIdx <= 0) {
  //     return;
  //   }

  //   const coord = getCursorPosition(canvas, nativeEvent);
  //   setPointsObj({
  //     ...pointsObj,
  //     [classBeingReviewedIdx]: [ ...pointsObj[classBeingReviewedIdx], coord ],
  //   });
  // };

  const handleSubmitButtonOnClick = () => {
    console.log(labels);
    //labels.forEach(label => {
      props.createAndSetMask(
        props.datasetBeingReviewedObj.name, props.datasetBeingReviewedObj.domain,
        props.imageBeingReviewedInfoObj.imageFilename, {labels}/*maskObj*/,
      );
    //}) 
  };

  const handleClassButtonItemOnClick = (classIdx, prevClassIdx) => {
    if (parseInt(classIdx) === 0 && prevClassIdx > 0) {
      setDrawPolygonWithPoints(true);
    }

    setClassBeingReviewedIdx(classIdx);
  }

  useEffect(() => {
    // Create class buttons to draw mask only for positive classes (except "OK", "normal", ...)
    if (props.datasetBeingReviewedObj !== null) {
      const tempClassesObj = {};
      // Put 'empty' class (to make it as a button for exiting the drawing mode)
      tempClassesObj[0] = '(release)';

      for (let classIdx in props.datasetBeingReviewedObj.classes) {
        if (props.datasetBeingReviewedObj.classes[classIdx] === 'OK' ||
          props.datasetBeingReviewedObj.classes[classIdx] === 'normal')
          continue
        if (classIdx > 0) {
          tempClassesObj[parseInt(classIdx)] = props.datasetBeingReviewedObj.classes[classIdx];
        }
      }
      setClassesObj(tempClassesObj);
    }
  }, [props.datasetBeingReviewedObj]);

  useEffect(() => {
    if (Object.keys(classesObj).length > 0) {
      const numGridsPerClass = Math.round(12 / Object.keys(classesObj).length);
      const tempClassButtonItems = [];
      for (let classIdx in classesObj) {
        const classButtonClassNamePostfix = classBeingReviewedIdx === classIdx ? 'btn-secondary text-white' : '';
        const classButtonItem =
          <button key={classIdx} type="button"
                  className={`col-sm-${numGridsPerClass} btn btn-lg btn-outline-secondary ${classButtonClassNamePostfix}`}
                  onClick={() => handleClassButtonItemOnClick(classIdx, classBeingReviewedIdx)}
          >
            { classesObj[classIdx] }
          </button>;
        tempClassButtonItems.push(classButtonItem);
      }
      setClassButtonItems(tempClassButtonItems);
    }
  }, [classesObj, classBeingReviewedIdx])

  useEffect(() => {
    const svg = svgRef.current;

    // Load image on canvas (when a new image is selected for review)
    if (
      props.imageBeingReviewedInfoObj.imageBlob !== null &&
      Object.keys(classesObj).length > 0
    ) {
      console.log("Load a new image");
      const imageURL = URL.createObjectURL(
        props.imageBeingReviewedInfoObj.imageBlob
      );
      const image = new Image();
      image.onload = () => {
        svg.style.width = image.width.toString();
        svg.style.height = image.height.toString();
        
        //console.log("img size",image.width, image.height);
        setImgSize({width: image.width, height: image.height});
      
        setClassBeingReviewedIdx(-1);

        // Initialize temp objects for maskObj and pointsObj
        // const tempMaskObj = {};
        // const tempPointsObj = {};
        // for (let classIdx in classesObj) {
        //   if (parseInt(classIdx) === 0) continue;
        //   tempMaskObj[classIdx] = [];
        //   tempPointsObj[classIdx] = [];
        // }

        //setLabels([]);  
        //Load existing mask and draw (if any) and put its data into maskObj
        imgSectionref.current.clearCanvas();
        const existingMask = props.imageBeingReviewedInfoObj.mask;   
        console.log('Load existing mask (if any)',existingMask);
        if(existingMask.labels !== undefined)
        {
          setLabels(Object.values(existingMask.labels));
          imgSectionref.current.applyExistingLabels();
        } 
        
        //setMaskObj(tempMaskObj);
        //setPointsObj(tempPointsObj);
        URL.revokeObjectURL(imageURL);
      };
      image.src = imageURL;
      svg.style.backgroundImage = "url('" + image.src + "')";
      svg.style.backgroundRepeat = "no-repeat";  
    } else {
      //context.clearRect(0, 0, canvas.width, canvas.height);
      setClassBeingReviewedIdx(-1);
    }
  }, [props.imageBeingReviewedInfoObj.imageBlob]);

  useEffect(() => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    // // Draw points on canvas (if any)
    // if (classBeingReviewedIdx > 0 && pointsObj[classBeingReviewedIdx].length > 0) {
    //   const pointsForClassBeingReviewed = pointsObj[classBeingReviewedIdx];
    //   drawPointForClass(context, classBeingReviewedIdx,
    //     pointsForClassBeingReviewed[pointsForClassBeingReviewed.length-1]);
    // }
    // // Draw a polygon on canvas (only for the classes that are ready to draw)
    // if (drawPolygonWithPoints === true) {
    //   for (let classIdx in pointsObj) {
    //     if (pointsObj[classIdx].length > 0) {
    //       // Draw polygons using the points
    //       drawPolygonForClass(context, classIdx, pointsObj[classIdx]);
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
        <h2 className="h5">{props.imageBeingReviewedInfoObj.imageFilename}</h2>
        <h2 className="h5">0.999</h2>
      </div> 

      <div className="d-flex align-items-center">
        <ImageSection
          imgRef={imgRef}
          svgRef={svgRef}
          labels={labels}
          ref={imgSectionref}
          imgW={imgSize.width}
          imgH={imgSize.height}
          setLabels={setLabels}
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