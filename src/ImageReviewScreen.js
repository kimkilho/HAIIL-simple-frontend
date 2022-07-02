import { useState, useEffect, useRef } from 'react';
import ImageSection from "./ImageView/ImageSection";

function ImageReviewScreen(props) {
  //const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const [labelButtonItems, setLabelButtonItems] = useState([]);
  // const [imginfo,setImageInfo] = useState();

  // useEffect(() => {
  //   console.log("changed imginfo",imginfo);   
  // }, [imginfo]);
 
  useEffect(() => {
    //const canvas = canvasRef.current;
    //const context = canvas.getContext('2d');
    const svg = svgRef.current;

    // Load image on canvas
    if (props.imageBeingReviewed.imageBlob !== null) {
      const image = new Image();

      image.src = URL.createObjectURL(props.imageBeingReviewed.imageBlob);
      image.onload = () => {
        svg.style.width = image.width.toString();
        svg.style.height = image.hieght.toString();
        
        URL.revokeObjectURL(image.src);
      };
      
      svg.style.backgroundImage = "url('" + image.src + "')";
      svg.style.backgroundPosition = "center";
      svg.style.backgroundRepeat = "no-repeat"; 

      // const imageURL = URL.createObjectURL(props.imageBeingReviewed.imageBlob);
      // const image = new Image();
      // image.onload = () => {
      //   context.clearRect(0, 0, canvas.width, canvas.height);
      //   context.drawImage(image, 0, 0);
      // }; 
      // image.src = imageURL;

    } else {
      //context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Create label buttons based on the classes of current dataset
    if (props.datasetBeingReviewed !== null) {
      const numGridsPerClass = Math.round(12 / Object.keys(props.datasetBeingReviewed.classes).length);
      const tempLabelButtonItems = [];
      for (let classIdx in props.datasetBeingReviewed.classes) {
        classIdx = parseInt(classIdx);
        const labelButtonClassNamePostfix =
          props.imageBeingReviewed.label === classIdx ? 'btn-secondary text-white' : '';
        const labelButtonItem =
          <button key={classIdx} type="button"
                  className={`col-sm-${numGridsPerClass} btn btn-lg btn-outline-secondary ${labelButtonClassNamePostfix}`}
                  onClick={() => props.createAndSetLabel(
                    props.datasetBeingReviewed.name, props.datasetBeingReviewed.domain,
                    props.imageBeingReviewed.imageFilename, classIdx,
                  )}
          >
            { props.datasetBeingReviewed.classes[classIdx] } (0.500)
          </button>;
        tempLabelButtonItems.push(labelButtonItem);
      }
      setLabelButtonItems(tempLabelButtonItems);
    }
  }, [props]);

  return (
    <div className="col-sm-6 px-md-4 align-items-center">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h4">Review Screen</h1>
      </div>
      <div className="d-flex justify-content-between">
        <h2 className="h5">{ props.imageBeingReviewed.imageFilename }</h2>
        <h2 className="h5">0.999</h2>
      </div>
      <div className="d-flex align-items-center">
        {/* <canvas className="mx-auto border" id="imageCanvas" width="512" height="512" ref={canvasRef}></canvas> */}
        <ImageSection imgRef={imgRef} svgRef={svgRef}/>
      </div>
      <div className="d-flex btn-toolbar align-items-center mt-1">
        { labelButtonItems }
      </div> 
    </div>
  )
}

export default ImageReviewScreen;