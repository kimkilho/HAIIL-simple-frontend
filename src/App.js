import './App.css';

const bootstrap = require('bootstrap');

// Layout reference: https://www.codeply.com/p/VVByb17KWb

function App() {
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  const dummyImageItems = [];
  for (let i = 0; i < 100; i++) {
    const imageFilename = `filename${i+1}.png`;
    const randomScore = Math.random().toFixed(3);
    const imageItem =
      <a key={i} className="list-group-item list-group-item-action py-1 lh-sm" href="#" aria-current="true">
        <div className="d-flex w-100 align-items-center justify-content-between">
          <span className="mb-1">{ imageFilename }</span>
          <strong>{ randomScore }</strong>
        </div>
      </a>;
    dummyImageItems.push(imageItem);
  }

  return (
    <main>
      {/* Header: "Headers" example */}
      <header>
        <div className="px-3 py-2 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
              <a className="d-flex align-items-center mb-3 my-lg-0 text-white text-decoration-none" href="/">
                <span className="fs-4">HAIIL Testbed (minimal)</span>
              </a>
              <div className="dropdown text-end">
                <button id="dropdownDataset" className="btn btn-secondary dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                  Datasets
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownDataset">
                  <li><a className="dropdown-item" href="#">DAGM-Domain1</a></li>
                  <li><a className="dropdown-item" href="#">DAGM-Domain2</a></li>
                  <li><a className="dropdown-item" href="#">DAGM-Domain3</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="d-flex flex-nowrap">
          {/* Non-reviewed images bar: "Sidebars" example */}
          <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
            <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom" href="/">
              <span className="fs-5 fw-semibold">Non-reviewed Images</span>
            </a>
            <div className="list-group list-group-flush border-bottom scrollarea">
              { dummyImageItems }
            </div>
          </div>

          {/* Image canvas: "Dashboard" example */}
          <div className="col-sm-6 px-md-4 align-items-center">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h4">Human Labeler: Review</h1>
            </div>
            <div className="d-flex align-items-center">
              <canvas className="mx-auto border" id="imageCanvas" width="512" height="512"></canvas>
            </div>
          </div>

          {/* Reviewed images bar: "Sidebars" example */}
          <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
            <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom" href="/">
              <span className="fs-5 fw-semibold">Reviewed Images</span>
            </a>
            <div className="list-group list-group-flush border-bottom scrollarea">
              { dummyImageItems }
            </div>
          </div>
        </div>
      </div>

      {/* Trainer section: "Footers" example */}
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
    </main>

  );
}

export default App;
