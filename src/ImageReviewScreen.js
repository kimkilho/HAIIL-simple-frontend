import { useEffect, useRef } from 'react';

function ImageReviewScreen(props) {
  const canvasRef = useRef(null);


  useEffect(() => {
    if (props.imageBlob) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const imageURL = URL.createObjectURL(props.imageBlob);
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
      };
      image.src = imageURL;
    }
  }, [props]);

  return (
    <div className="col-sm-6 px-md-4 align-items-center">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h4">Human Labeler: Review</h1>
      </div>
      <div className="d-flex align-items-center">
        <canvas className="mx-auto border" id="imageCanvas" width="512" height="512" ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default ImageReviewScreen;