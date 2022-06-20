function ImageReviewScreen(props) {

  return (
    <div className="col-sm-6 px-md-4 align-items-center">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h4">Human Labeler: Review</h1>
      </div>
      <div className="d-flex align-items-center">
        <canvas className="mx-auto border" id="imageCanvas" width="512" height="512"></canvas>
      </div>
    </div>
  )
}

export default ImageReviewScreen;