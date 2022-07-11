function Header(props) {
  return (
    <header>
      <div className="px-3 py-2 bg-dark text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <a className="d-flex align-items-center mb-3 my-lg-0 text-white text-decoration-none" href="/">
              <span className="fs-4">HAIIL Testbed (minimal)</span>
            </a>
            <div className="d-flex align-items-end">
              <div className="dropdown text-end me-3">
                <button id="samplingScoreMetric" className="btn btn-light dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  { props.selectedSamplingScoreMetricItemName }
                </button>
                <ul className="dropdown-menu" aria-labelledby="samplingScoreMetric">
                  { props.samplingScoreMetricItems }
                </ul>
              </div>
              <div className="dropdown text-end">
                <button id="dropdownDataset" className="btn btn-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  { props.selectedDatasetItemName }
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownDataset">
                  { props.datasetItems }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;