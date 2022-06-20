function ModelListFooter(props) {

  return (
    <div className="container">
      <div className="px-3 py-2">
        <footer className="d-flex flex-nowrap justify-content-start align-items-center py-3 my-0 border-top">
          <div className="col-md-1 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-black">Models</span>
          </div>
          <div className="py-3 px-2 bg-light border rounded-3">
            <span className="text-black">model_v1</span>
          </div>
          <div className="py-3 px-2 bg-light border rounded-3">
            <span className="text-black">model_v2</span>
          </div>
          <div className="py-3 px-2 bg-light border rounded-3">
            <span className="text-black">model_v3</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ModelListFooter;