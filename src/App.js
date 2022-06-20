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
  const [imageBeingReviewed, setImageBeingReviewed] = useState(
    { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null }
  );

  const readAndSetDatasetObjs = async () => {
    const response = await fetch(
      '/api/datasets/',
      { method: 'GET' }
    );

    if (response.status === 200) {
      const datasetData = await response.json();
      setDatasetObjs(datasetData);
    }
  };

  const readAndSetImageListsObj = async (datasetName, domainName) => {
    const datasetId = `${datasetName}-${domainName}`;
    const imageListObj = { reviewed: null, nonreviewed: null };
    for (let imageset of ['reviewed', 'nonreviewed']) {
      const requestUrlQuery = `?reviewed=${imageset === 'reviewed' ? 'true' : 'false'}`;
      const response = await fetch(
        `/api/datasets/${datasetName}/domains/${domainName}/images/${requestUrlQuery}`,
        { method: 'GET' },
      );

      if (response.status === 200) {
        imageListObj[imageset] = await response.json();
      }
    }

    setImageListsObj({ ...imageListsObj, [datasetId]: imageListObj });
  };

  const readImageBlob = async (datasetName, domainName, imageFilename)  => {
    const response = await fetch(
      `/api/datasets/${datasetName}/domains/${domainName}/images/${imageFilename}`,
      { method: 'GET' },
    );

    if (response.status === 200) {
      return await response.blob();
    }
  };

  const handleImageItemOnClick = async (imageset, imageFilename, i) => {
    const datasetName = datasetObjs[datasetObjIdx].name;
    const domainName = datasetObjs[datasetObjIdx].domain;
    const imageBlob = await readImageBlob(datasetName, domainName, imageFilename);

    setImageBeingReviewed({ ...imageBeingReviewed,
      imageset: imageset, imageItemIdx: i,
      imageFilename: imageFilename, imageBlob: imageBlob });
  }

  const clearImageBeingReviewed = () => {
    setImageBeingReviewed(
      { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null }
    );
  };

  useEffect(() => {
    if (datasetObjs === null) {
      readAndSetDatasetObjs();
    } else {
      const datasetName = datasetObjs[datasetObjIdx].name;
      const domainName = datasetObjs[datasetObjIdx].domain;
      const datasetId = `${datasetName}-${domainName}`;

      if (imageListsObj[datasetId] === undefined) {
        readAndSetImageListsObj(datasetName, domainName);
      } else {
        const tempImageItems = { reviewed: [], nonreviewed: [] };
        ['nonreviewed', 'reviewed'].forEach((imageset) => {
          imageListsObj[datasetId][imageset].forEach((imageObj, i) => {
            const imageFilename = imageObj.name;
            const score = 0.999;    // FIXME
            let activeFlag;
            if (imageBeingReviewed.imageset === imageset &&
                imageBeingReviewed.imageItemIdx === i)
              activeFlag = ' active';
            else
              activeFlag = '';
            const imageItem =
              <a key={i} href="#" onClick={() => handleImageItemOnClick(imageset, imageFilename, i)}
                 className={'list-group-item list-group-item-action py-1 lh-sm' + activeFlag}
                 aria-current="true">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <span className="mb-1">{ imageFilename }</span>
                  <strong>{ score }</strong>
                </div>
              </a>;
            tempImageItems[imageset].push(imageItem);
          });
        });
        setImageItems(tempImageItems);
      }
    }
  }, [datasetObjs, datasetObjIdx, imageListsObj, imageBeingReviewed]);

  return (
    <main>
      <Header
        datasetObjs={datasetObjs}
        datasetObjIdx={datasetObjIdx}
        setDatasetObjIdx={setDatasetObjIdx}
        clearImageBeingReviewed={clearImageBeingReviewed}
      />
      <div className="container">
        <div className="d-flex flex-nowrap">
          <ImageList
            title='Non-reviewed Images'
            imageItems={imageItems.nonreviewed}
          />

          <ImageReviewScreen
            imageBeingReviewed={imageBeingReviewed}
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
