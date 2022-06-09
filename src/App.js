import './App.css';

const bootstrap = require('bootstrap');

// Layout reference: https://www.codeply.com/p/VVByb17KWb

function App() {
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });

  return (
    <main>
      <header>
        <div className="px-3 py-2 bg-dark text-white">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a className="d-flex align-items-center mb-3 my-lg-0 me-lg-auto text-white text-decoration-none" href="/">
                <span className="fs-4">HAIIL Testbed (minimal)</span>
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="d-flex flex-nowrap">
        {/* Datasets bar: "Sidebars" example */}
        <div className="flex-shrink-0 p-3 bg-white" style={{width: '180px'}}>
          <a className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom" href="/">
            <span className="fs-5 fw-semibold">Datasets</span>
          </a>
          <ul className="list-unstyled ps-0">
            <li className="mb-1">
              <button className="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
                      data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                DAGM
              </button>
              <div id="home-collapse" className="collapse show">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  <li>
                    <a className="link-dark d-inline-flex text-decoration-none rounded" href="#">
                      Domain1
                    </a>
                  </li>
                  <li>
                    <a className="link-dark d-inline-flex text-decoration-none rounded" href="#">
                      Domain2
                    </a>
                  </li>
                  <li>
                    <a className="link-dark d-inline-flex text-decoration-none rounded" href="#">
                      Domain3
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* Images bar: "Sidebars" example */}
        <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px'}}>
          <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom" href="/">
            <span className="fs-5 fw-semibold">Images</span>
          </a>
          <div className="list-group list-group-flush border-bottom scrollarea">
            <a className="list-group-item list-group-item-action py-3 lh-sm" href="#" aria-current="true">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">filename1.png</strong>
                <small>0.867</small>
              </div>
            </a>
            <a className="list-group-item list-group-item-action py-3 lh-sm" href="#" aria-current="true">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">filename2.png</strong>
                <small>0.335</small>
              </div>
            </a>
            <a className="list-group-item list-group-item-action py-3 lh-sm" href="#" aria-current="true">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">filename3.png</strong>
                <small>1.000</small>
              </div>
            </a>
          </div>
        </div>

        {/* Image canvas: "Dashboard" example */}
        <div className="col-sm-6 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h4">Human Labeler: Review</h1>
          </div>
          <canvas className="my-4 w-100" id="imageCanvas" width="900" height="380"></canvas>
        </div>
      </div>
      {/* Trainer section: "Footers" example */}
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-2 d-flex align-items-center">
            <span className="mb-3 mb-md-0 text-muted">Trainer Status</span>
          </div>
        </footer>
      </div>
    </main>



  );
}

export default App;
