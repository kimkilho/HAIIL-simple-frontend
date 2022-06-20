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
  const [datasetObjs, setDatasetObjs] = useState([]);    // [...]
  const [datasetObjIdx, setDatasetObjIdx] = useState(0);
  const [imageListsObj, setImageListsObj] = useState({});    // { datasetId: { reviewed: [...], nonreviewed: [...] }
  const [imageItems, setImageItems] = useState({ reviewed: [], nonreviewed: [] });
  const [imageBeingReviewed, setImageBeingReviewed] = useState(
    { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null, label: -1 }
  );

  const readAndSetDatasetObjs = async () => {
    const response = await fetch(
      '/api/datasets/',
      { method: 'GET' }
    );

    if (response.status === 200) {
      const _datasetObjs = await response.json();
      setDatasetObjs(_datasetObjs);
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

  const readLabelObj = async (datasetName, domainName, imageFilename) => {
    const response = await fetch(
      `/api/datasets/${datasetName}/domains/${domainName}/images/${imageFilename}/labels/`,
      { method: 'GET' },
    );

    if (response.status === 200) {
      return await response.json();
    }
  };

  const createAndSetLabel = async (datasetName, domainName, imageFilename, label) => {
    const labeledAt = Date.now();    // unix timestamp (in milliseconds)
    const data = {
      dataset_name: datasetName, domain_name: domainName, image_filename: imageFilename,
      label: label, labeled_at: labeledAt,
    };
    const response = await fetch(
      '/api/labels',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status === 200) {
      const _labelObj = await response.json();
      setImageBeingReviewed({ ...imageBeingReviewed, label: _labelObj.label })
    }
  }

  const handleImageItemOnClick = async (imageset, imageFilename, i) => {
    const datasetName = datasetObjs[datasetObjIdx].name;
    const domainName = datasetObjs[datasetObjIdx].domain;
    const imageBlob = await readImageBlob(datasetName, domainName, imageFilename);
    const labelObj = await readLabelObj(datasetName, domainName, imageFilename);

    setImageBeingReviewed({ ...imageBeingReviewed,
      imageset: imageset, imageItemIdx: i,
      imageFilename: imageFilename, imageBlob: imageBlob,
      label: labelObj.length > 0 ? labelObj[labelObj.length-1].label : -1,
    });
  }

  const clearImageBeingReviewed = () => {
    setImageBeingReviewed(
      { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null, label: -1 }
    );
  };

  useEffect(() => {
    if (datasetObjs.length === 0) {
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
            datasetBeingReviewed={datasetObjs.length === 0 ? null : datasetObjs[datasetObjIdx]}
            imageBeingReviewed={imageBeingReviewed}
            createAndSetLabel={createAndSetLabel}
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
