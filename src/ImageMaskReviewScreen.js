import { useState, useEffect, useRef } from 'react';
import ImageSection from '../src/ImageView/ImageSection';
import styled from 'styled-components';
import { Blob } from './ImageView/imageinfo.tsx';

const MainDiv = styled.div` 
  //background-color: #212936; 
`;

const MASK_COLORS = ['#DB7093','#DEEF73','#719ADD','#FBD2A6','#14594B'];

function ImageMaskReviewScreen(props) {
  const imgSectionRef = useRef({});
  const svgRef = useRef(null);
  const imgRef = useRef(null);
  const [maskObjs, setMaskObjs] = useState([]);
  /*
    [  ( # elements: # blobs in an image)
      Blob(
        no: <int>,
        classId: <int>,
        classColor: <string>,
        type: <string>,
        thickness: <int>,
        data: [  (# elements: # points in a blob)
          [<int>, <int>], ...
        ],
      ), ...
    ]
   */
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  const handleSubmitButtonOnClick = () => {
    const { id, name, domain, classes } = props.selectedDatasetObj;
    const imageFilename = props.selectedImageInfoObj.imageFilename;

    props.createAndSetMask(
      id, name, domain, imageFilename,
      { blobs: maskObjs }    // NOTE: Should put maskObjs array into an object to pass it as a JSON data
    );
  };

  const handleConvertButtonOnClick = () => {
    const { id, name, domain, classes } = props.selectedDatasetObj;
    const imageFilename = props.selectedImageInfoObj.imageFilename;
    
    if (maskObjs.length > 0) {
      maskObjs.forEach(mask => {
        if (mask.type === "predict") {
          mask.type = "polygon";
        } 
      });
      setMaskObjs(maskObjs);
      imgSectionRef.current.clearCanvas();
      imgSectionRef.current.applyExistingMasks();

      // props.createAndSetMask(
      //   id, name, domain, imageFilename,
      //   { blobs: maskObjs }    // NOTE: Should put maskObjs array into an object to pass it as a JSON data
      // );
    }
  };

  useEffect(() => {
    const svg = svgRef.current;
    // Load image on ImageCanvas (when a new image is selected for review)
    if (props.selectedImageInfoObj.imageBlob !== null) {
      console.log("Load a new image");
      const imageURL = URL.createObjectURL(props.selectedImageInfoObj.imageBlob);
      const image = new Image();
      image.onload = () => {
        svg.style.width = image.width.toString();
        svg.style.height = image.height.toString();

        setImgSize({ width: image.width, height: image.height });

        svg.style.backgroundImage = "url('" + image.src + "')";
        svg.style.backgroundRepeat = "no-repeat";
        imgSectionRef.current.zoomFit();
        imgSectionRef.current.clearCanvas();

        // Initialize temp objects for maskObjs
        const tempMaskObjs = [];
        let classColor;

        // Load and draw existing mask (if any) and put its data into tempMaskObjs
        const existingMaskData = props.selectedImageInfoObj.mask;
        console.log("Draw existing mask (if any)", existingMaskData);
        existingMaskData.forEach((existingMaskDataElem, idx) => {
          const { classId, data, thickness, type } = existingMaskDataElem;
          classColor = MASK_COLORS[classId-1];
          tempMaskObjs.push(new Blob(
            idx, classId, classColor, type, thickness, data, null,
          ));
        })

        // Load and draw existing predMask (if any) and put its data into tempMaskObjs
        const existingPseudoMaskData = props.selectedImageInfoObj.pseudoMask;
        console.log("Draw existing pseudoMask (if any)", existingPseudoMaskData);
        const endIdx = Object.keys(tempMaskObjs).length;
        existingPseudoMaskData.forEach((existingPseudoMaskDataElem, idx) => {
          const { classId, data } = existingPseudoMaskDataElem;
          classColor = MASK_COLORS[classId-1];
          tempMaskObjs.push(new Blob(
            endIdx+idx, classId, classColor, 'predict', 1, data, null,
          ));
        });

        setMaskObjs(tempMaskObjs);
        console.log('Mask loaded', tempMaskObjs);
        imgSectionRef.current.applyExistingMasks();

        // URL.revokeObjectURL(imageURL);
      };
      image.src = imageURL;
    }
  }, [props.selectedImageInfoObj.imageId, props.selectedImageInfoObj.segNetId]);

  return (
    <MainDiv className="col-sm-7 px-md-4 align-items-center">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h4">Review Screen</h1>
      </div>
      <div className="d-flex justify-content-between">
        <h2 className="h5">{props.selectedImageInfoObj.imageFilename}</h2>
        <h2 className="h5">
          {props.selectedImageSamplingScoresFromSelectedSegNetObj}
        </h2>
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
        />
      </div>
      <div className="d-flex">
        <div className="d-flex btn-toolbar align-items-center mt-1 me-1" style={{width:"100%"}}>
          <button
            type="button"
            className="col-sm-12 btn btn-lg btn-outline-primary shadow-none"
            onClick={handleConvertButtonOnClick}
          >
            CONVERT
          </button>
        </div>
        <div className="d-flex btn-toolbar align-items-center mt-1 ms-1" style={{width:"100%"}}>
          <button
            type="button"
            className="col-sm-12 btn btn-lg btn-outline-primary shadow-none" 
            onClick={handleSubmitButtonOnClick}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </MainDiv>
  );
}

export default ImageMaskReviewScreen;
