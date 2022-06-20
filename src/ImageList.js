function ImageList(props) {
  return (
    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
      <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom" href="/">
        <span className="fs-5 fw-semibold">{ props.title }</span>
      </a>
      <div className="list-group list-group-flush border-bottom scrollarea">
        { props.imageItems }
      </div>
    </div>
  )
}

export default ImageList;