import { useState, useEffect, useRef } from 'react';
function ImageLabelReviewScreen(props) {
  const canvasRef = useRef(null);
  const [labelButtonItems, setLabelButtonItems] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Load image on canvas
    if (props.imageBeingReviewedInfoObj.imageBlob !== null) {
      const imageURL = URL.createObjectURL(props.imageBeingReviewedInfoObj.imageBlob);
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
      };
      image.src = imageURL;
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Create label buttons based on the classes of current dataset
    if (props.datasetBeingReviewedObj !== null) {
      const numGridsPerClass = Math.round(12 / Object.keys(props.datasetBeingReviewedObj.classes).length);
      const tempLabelButtonItems = [];
      for (let classIdx in props.datasetBeingReviewedObj.classes) {
        classIdx = parseInt(classIdx);
        const labelButtonClassNamePostfix =
          props.imageBeingReviewedInfoObj.label === classIdx ? 'btn-secondary text-white' : '';
        const labelButtonItem =
          <button key={classIdx} type="button"
                  className={`col-sm-${numGridsPerClass} btn btn-lg btn-outline-secondary ${labelButtonClassNamePostfix}`}
                  onClick={() => props.createAndSetLabel(
                    props.datasetBeingReviewedObj.name, props.datasetBeingReviewedObj.domain,
                    props.imageBeingReviewedInfoObj.imageFilename, classIdx,
                  )}
          >
            { props.datasetBeingReviewedObj.classes[classIdx] } (0.500)
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
        <h2 className="h5">{ props.imageBeingReviewedInfoObj.imageFilename }</h2>
        <h2 className="h5">0.999</h2>
      </div>
      <div className="d-flex align-items-center">
        <canvas className="mx-auto border" id="imageCanvas" width="512" height="512" ref={canvasRef}></canvas> 
      </div>
      <div className="d-flex btn-toolbar align-items-center mt-1">
        { labelButtonItems }
      </div>
    </div>
  )
}

export default ImageLabelReviewScreen;