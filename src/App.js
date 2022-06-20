import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import ImageList from './ImageList';
import ImageReviewScreen from './ImageReviewScreen';
import ModelListFooter from './ModelListFooter';

const bootstrap = require('bootstrap');
const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new bootstrap.Tooltip(tooltipTriggerEl);
});

function App() {
  const [datasetObjs, setDatasetObjs] = useState(null);    // [...]
  const [datasetObjIdx, setDatasetObjIdx] = useState(0);
  const [imageListsObj, setImageListsObj] = useState({});    // { datasetId: { reviewed: [...], nonreviewed: [...] }
  const [imageItems, setImageItems] = useState({ reviewed: [], nonreviewed: [] });

  const fetchDatasetObjs = async () => {
    const response = await fetch(
      '/api/datasets/',
      { method: 'GET' }
    );

    if (response.status === 200) {
      const datasetData = await response.json();
      setDatasetObjs(datasetData);
    }
  };

  const fetchImageListsObj = async (datasetName, domainName) => {
    const datasetId = `${datasetName}-${domainName}`;
    const imageListObj = { reviewed: null, nonreviewed: null };
    for (let key of ['reviewed', 'nonreviewed']) {
      const requestUrlQuery = `?reviewed=${key === 'reviewed' ? 'true' : 'false'}`;
      const response = await fetch(
        `/api/datasets/${datasetName}/domains/${domainName}/images/${requestUrlQuery}`,
        { method: 'GET' },
      );

      if (response.status === 200) {
        imageListObj[key] = await response.json();
      }
    }

    setImageListsObj({...imageListsObj, [datasetId]: imageListObj});
  };

  useEffect(() => {
    if (datasetObjs === null) {
      fetchDatasetObjs();
    } else {
      const datasetName = datasetObjs[datasetObjIdx].name;
      const domainName = datasetObjs[datasetObjIdx].domain;
      const datasetId = `${datasetName}-${domainName}`;

      if (imageListsObj[datasetId] === undefined) {
        fetchImageListsObj(datasetName, domainName);
      } else {
        const tempImageItems = { reviewed: [], nonreviewed: [] };
        ['nonreviewed', 'reviewed'].forEach((key) => {
          imageListsObj[datasetId][key].forEach((imageObj, i) => {
            const imageFilename = imageObj.name;
            const score = 0.999;    // FIXME
            const imageItem =
              <a key={i} className="list-group-item list-group-item-action py-1 lh-sm" href="#" aria-current="true">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <span className="mb-1">{ imageFilename }</span>
                  <strong>{ score }</strong>
                </div>
              </a>;
            tempImageItems[key].push(imageItem);
          });
        });
        setImageItems(tempImageItems);
      }
    }
  }, [datasetObjs, datasetObjIdx, imageListsObj]);

  return (
    <main>
      <Header
        datasetObjs={datasetObjs}
        datasetObjIdx={datasetObjIdx}
        setDatasetObjIdx={setDatasetObjIdx}
      />
      <div className="container">
        <div className="d-flex flex-nowrap">
          <ImageList
            title='Non-reviewed Images'
            imageItems={imageItems.nonreviewed}
          />

          <ImageReviewScreen
          />

          <ImageList
            title='Reviewed Images'
            imageItems={imageItems.reviewed}
          />
        </div>
      </div>

      <ModelListFooter
      />
    </main>

  );
}

export default App;
