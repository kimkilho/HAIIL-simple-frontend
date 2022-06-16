import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';

const bootstrap = require('bootstrap');
const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new bootstrap.Tooltip(tooltipTriggerEl);
});

function App() {
  const [datasetObjs, setDatasetObjs] = useState([]);
  const [datasetObjIdx, setDatasetObjIdx] = useState(0);

  const fetchDatasets = async () => {
    const response = await fetch('/api/datasets/', { method: 'GET' });

    if (response.status === 200) {
      const datasetData = await response.json();
      setDatasetObjs(datasetData);
    }
  };

  useEffect(() => {
    if (datasetObjs.length === 0) {
      fetchDatasets();
    }
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
      <Header
        datasetObjs={datasetObjs}
        datasetObjIdx={datasetObjIdx}
        setDatasetObjIdx={setDatasetObjIdx}
      />
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

          {/* Image canvas: Bootstrap5 "Dashboard" example */}
          <div className="col-sm-6 px-md-4 align-items-center">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h1 className="h4">Human Labeler: Review</h1>
            </div>
            <div className="d-flex align-items-center">
              <canvas className="mx-auto border" id="imageCanvas" width="512" height="512"></canvas>
            </div>
          </div>

          {/* Reviewed images bar: Bootstrap5 "Sidebars" example */}
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

      {/* Trainer section: Bootstrap5 "Footers" example */}
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
