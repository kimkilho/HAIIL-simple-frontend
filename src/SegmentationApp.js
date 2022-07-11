import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import ImageList from './ImageList';
import ImageMaskReviewScreen from './ImageMaskReviewScreen';
import NetListFooter from './NetListFooter';
import {
  readDatasetObjs, readImageObjs, readImageBlob, readMaskObjs, createMask,
  readSegNetObjs, readSegNetPredObjsOnImage, requestSegNetTrain,
} from './requests';

function SegmentationApp() {
  // ------------- States for holding the whole data received from the backend ------------------
  const [datasetObjs, setDatasetObjs] = useState({});
  /*
    {
      (datasetId) <int>: {
        id: <int>, name: <string>, domain: <string|null>, classes: <object>
      }
    }
   */
  const [segNetListsNestedObj, setSegNetListsNestedObj] = useState({});
  /*
    {
      (datasetId) <int>: {
        (segNetId) <int>: {
          id: <int>, dataset_id: <int>, name: <string>, version: <int>, train_mask_ids: [<int>],
          job_id: <string>, status: <string>,
        }
      }
    }
   */
  const [imageListsNestedObj, setImageListsNestedObj] = useState({});
  /*
    {
      (datasetId) <int>: {
        reviewed: [ { id: <int>, dataset_id: <int>, gt_label: <int|null>, gt_mask: <int|null> } ],
        nonreviewed: [ { id: <int>, dataset_id: <int>, gt_label: <int|null>, gt_mask: <int|null> } ],
      }
    }
   */

  // ------------------ States for HTML elements that depend on the data above -----------------
  const [datasetItems, setDatasetItems] = useState([]);   // [ <HTML element> ]
  const [imageItems, setImageItems] = useState({ reviewed: [], nonreviewed: [] });
    // { reviewed: [ <HTML element> ], nonreviewed: [ <HTML element> ] }
  const [segNetItems, setSegNetItems] = useState([]);   // [ <HTML element> ]

  // ------------------ States for tracking the currently selected objects ---------------------
  const [selectedDatasetId, setSelectedDatasetId] = useState(1);    // int (default dataset id: 1)
  const [selectedImageInfoObj, setSelectedImageInfoObj] = useState(
    { imageset: '', imageId: 0, imageFilename: '', imageBlob: null, mask: [], segNetId: 0, pseudoMask: [] }
  );
  /*
    {
      imageset: <string>, imageId: <int>, imageFilename: <string>, imageBlob: <Blob>, mask: <array>,
      segNetId: <int>, pseudoMask: <array>
    }
  */
  const [ongoingTrainJobExists, setOngoingTrainJobExists] = useState({});    // { (dataset_id) <int>: <bool> }
  const [segNetTrainConfig, setSegNetTrainConfig] = useState({ numEpochs: 10 });    // TODO: Add more hyperparameters

  const readAndSetDatasetObjs = async () => {
    const datasetObjsList = await readDatasetObjs();
    const tempDatasetObjs = {};
    for (let datasetObj of datasetObjsList) {
      const datasetId = datasetObj.id;
      tempDatasetObjs[datasetId] = datasetObj;
    }

    setDatasetObjs(tempDatasetObjs);
  };

  const readAndSetSegNetObjs = async (datasetId) => {
    const segNetObjsList = await readSegNetObjs(datasetId);
    const tempSegNetObjs = {};
    let repeat = false;
    for (let segNetObj of segNetObjsList) {
      const segNetId = segNetObj.id;
      tempSegNetObjs[segNetId] = segNetObj;

      const jobStatus = segNetObj['job_status'];
      if (!(jobStatus === 'SUCCESS' || jobStatus === 'FAILURE')) {
        repeat = true;
      }
    }
    setSegNetListsNestedObj({
      ...segNetListsNestedObj,
      [datasetId]: tempSegNetObjs,
    });

    // Call this function repeatedly if there is any ongoing training job
    if (repeat === true) {
      setOngoingTrainJobExists({
        ...ongoingTrainJobExists,
        [datasetId]: true,
      });
      setTimeout(() => {
        readAndSetSegNetObjs(datasetId);
      }, 1000);
    } else {
      setOngoingTrainJobExists({
        ...ongoingTrainJobExists,
        [datasetId]: false,
      });
    }
  };

  const readAndSetImageListsNestedObj = async (datasetId) => {
    if (!(datasetId in imageListsNestedObj)) {
      const tempImageListsObj = { reviewed: null, nonreviewed: null };

      for (let imageset of ['reviewed', 'nonreviewed']) {
        const reviewed = imageset === 'reviewed';
        tempImageListsObj[imageset] = await readImageObjs(datasetId, 'segmentation', reviewed);
      }

      setImageListsNestedObj({ ...imageListsNestedObj, [datasetId]: tempImageListsObj })
    }
  };

  const flagImageObjAsReviewInImageListsNestedObj = async (datasetId, imageFilename) => {
    const imageListsObj = imageListsNestedObj[datasetId];
    const imageObj = imageListsObj.nonreviewed.filter(obj => obj.name === imageFilename);
    setImageListsNestedObj({ ...imageListsNestedObj,
      [datasetId]: {
        nonreviewed: imageListsObj.nonreviewed.filter(obj => obj.name !== imageFilename),    // removal
        reviewed: imageListsObj.reviewed.concat(imageObj),    // addition
      },
    });
  };

  const createAndSetMask = async (datasetId, datasetName, domainName, imageFilename, mask) => {
    const maskObj = await createMask(datasetName, domainName, imageFilename, mask);
    const maskData = maskObj.mask.blobs;
    setSelectedImageInfoObj({ ...selectedImageInfoObj, mask: maskData });

    // Flag the image as 'reviewed'
    flagImageObjAsReviewInImageListsNestedObj(datasetId, imageFilename);
  };

  const handleImageItemOnClick = async (imageset, imageId, imageFilename) => {
    const imageBlob = await readImageBlob(imageId);
    const maskObjs = await readMaskObjs(imageId);

    let maskData = [];
    if (maskObjs.length > 0)
      maskData = maskObjs[maskObjs.length-1].mask.blobs;    // FIXME maybe: load the latest mask

    let pseudoMaskData = [];
    const selectedSegNetId = selectedImageInfoObj.segNetId;
    if (selectedSegNetId > 0) {
      const segNetPredObjs = await readSegNetPredObjsOnImage(selectedSegNetId, imageId);
      if (segNetPredObjs.length > 0) {
        pseudoMaskData = segNetPredObjs[0]['pseudo_mask'].blobs;    // always be one element at maximum
      }
    }

    setSelectedImageInfoObj({
      ...selectedImageInfoObj,
      imageset: imageset, imageId: imageId, imageFilename: imageFilename, imageBlob: imageBlob,
      mask: maskData, pseudoMask: pseudoMaskData,
    });
  }

  const clearSelectedImageInfoObj = () => {
    setSelectedImageInfoObj(
      { imageset: '', imageId: 0, imageFilename: '', imageBlob: null, mask: [], segNetId: 0, pseudoMask: [] }
    );
  };

  const handleSegNetItemOnClick = async (segNetId) => {
    const selectedImageId = selectedImageInfoObj.imageId;

    let pseudoMaskData = [];
    if (selectedImageId > 0) {
      const segNetPredObjs = await readSegNetPredObjsOnImage(segNetId, selectedImageId);
      if (segNetPredObjs.length > 0) {
        pseudoMaskData = segNetPredObjs[0]['pseudo_mask'].blobs;    // always be one element at maximum
      }
    }
    setSelectedImageInfoObj({
      ...selectedImageInfoObj,
      segNetId: segNetId,
      pseudoMask: pseudoMaskData,
    })
  };

  const handleSegNetTrainConfigChange = (event) => {
    const target = event.target;
    setSegNetTrainConfig({
      ...segNetTrainConfig,
      [target.name]: target.value,
    })
  };

  const handleSegNetTrainConfigSubmit = (event) => {
    console.log('handleSegNetTrainConfigSubmit called', segNetTrainConfig);
    event.preventDefault();
  }

  const requestSegNetTrainOnSelectedDataset = async () => {
    const { name: datasetName, domain: domainName } = datasetObjs[selectedDatasetId];
    const { numEpochs } = segNetTrainConfig;
    const responseData = await requestSegNetTrain(datasetName, domainName, 'mask', numEpochs);
    // const { job_id: jobId, job_status: jobStatus } = responseData;

    // Call readAndSetSegNetObjs function to start interval, if there is no ongoing training job
    if (!(selectedDatasetId in ongoingTrainJobExists) || (ongoingTrainJobExists[selectedDatasetId] === false)) {
      setOngoingTrainJobExists({
        ...ongoingTrainJobExists,
        [selectedDatasetId]: true,
      });
      setTimeout(() => readAndSetSegNetObjs(selectedDatasetId), 1000);    // wait for 1000 ms to apply above line
    }
  };

  const handleDatasetOnClick = (id) => {
    setSelectedDatasetId(id);
    clearSelectedImageInfoObj();
  }

  useEffect(() => {
    if (Object.keys(datasetObjs).length === 0) {
      // Read and set datasets
      readAndSetDatasetObjs();
    } else {
      const tempDatasetItems = [];
      for (let datasetId in datasetObjs) {
        datasetId = parseInt(datasetId);    // NOTE: This must be added because for...in loop automatically converts the iterator to string
        const { id, name: datasetName, domain: domainName, classes } = datasetObjs[datasetId];
        const datasetItem =
          <li key={datasetId}>
            <a className={"dropdown-item" + (selectedDatasetId === datasetId ? ' active' : '')}
               href="#" onClick={() => handleDatasetOnClick(datasetId)}>
              {datasetName + ' - ' + domainName}
            </a>
          </li>;
        tempDatasetItems.push(datasetItem);
      }
      setDatasetItems(tempDatasetItems);
    }
  }, [datasetObjs, selectedDatasetId]);

  useEffect(() => {
    if (Object.keys(datasetObjs).length > 0) {
      const { id: datasetId } = datasetObjs[selectedDatasetId];

      // Read and set up image list
      if (imageListsNestedObj[datasetId] === undefined) {
        readAndSetImageListsNestedObj(datasetId);
      } else {
        const tempImageItems = { reviewed: [], nonreviewed: [] };
        ['nonreviewed', 'reviewed'].forEach((imageset) => {
          imageListsNestedObj[datasetId][imageset].forEach((imageObj, i) => {
            const imageId = imageObj.id;
            const imageFilename = imageObj.name;
            const score = 0.999;    // FIXME later
            let activeFlag;
            if (selectedImageInfoObj.imageId === imageId)
              activeFlag = ' active';
            else
              activeFlag = '';
            const imageItem =
              <a key={imageId} href="#" onClick={() => handleImageItemOnClick(imageset, imageId, imageFilename)}
                 className={'list-group-item list-group-item-action py-1 lh-sm' + activeFlag}
                 aria-current="true"
              >
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
  }, [datasetObjs, selectedDatasetId, imageListsNestedObj, selectedImageInfoObj]);

  useEffect(() => {
    if (Object.keys(datasetObjs).length > 0) {
      // Read and set up segnet list
      if (!(selectedDatasetId in segNetListsNestedObj)) {
        readAndSetSegNetObjs(selectedDatasetId);
      } else {
        const selectedSegNetId = selectedImageInfoObj.segNetId;
        const tempSegNetItems = [];

        // Add segnet items that are (1) already trained or (2) being trained
        for (let segNetId in segNetListsNestedObj[selectedDatasetId]) {
          segNetId = parseInt(segNetId);    // NOTE: This must be added because for...in loop automatically converts the iterator to string
          const { name: segNetName, version: segNetVersion, train_mask_ids: trainMaskIds,
                  job_id: jobId, job_status: jobStatus } = segNetListsNestedObj[selectedDatasetId][segNetId];

          let trainSetSize = 0;
          if (trainMaskIds !== null) {
            trainSetSize = trainMaskIds.length;
          }
          const segNetItemClassNamePostfix = selectedSegNetId === segNetId ? 'btn-success text-white' : '';

          const segNetItem =
            <button key={segNetId} onClick={() => handleSegNetItemOnClick(segNetId)}
                    className={`btn btn-sm btn-outline-success me-2 py-3 ${segNetItemClassNamePostfix}`}
                    style={{ fontSize: '0.8rem' }}
            >
              <p className="text-left mb-0">{ segNetName }</p>
              <p className="text-left mb-0">(ver. { segNetVersion }: { trainSetSize } train samples)</p>
              <p className="text-left mb-0"><small>(Status: { jobStatus })</small></p>
              <p className="text-left mb-0"><small>(Job id: { jobId })</small></p>
            </button>;
          tempSegNetItems.push(segNetItem);
        }
        setSegNetItems(tempSegNetItems);
      }
    }
  }, [datasetObjs, selectedDatasetId, segNetListsNestedObj,
           selectedImageInfoObj.segNetId, selectedImageInfoObj.imageId]);

  let selectedDatasetObj;
  if (Object.keys(datasetObjs).length > 0 && selectedDatasetId > 0) {
    selectedDatasetObj = datasetObjs[selectedDatasetId];
  } else {
    selectedDatasetObj = null;
  }

  return (
    <main className="d-flex flex-column h-100">
      <Header
        datasetItems={datasetItems}
        selectedDatasetItemName={selectedDatasetObj === null ?
                                  'Datasets' :
                                  selectedDatasetObj.name + ' - ' + selectedDatasetObj.domain}
      />
      <div className="container">
        <div className="d-flex flex-nowrap">
          <ImageList
            title='Non-reviewed Images'
            imageItems={imageItems.nonreviewed}
          />

          <ImageMaskReviewScreen
            selectedDatasetObj={selectedDatasetObj}
            selectedImageInfoObj={selectedImageInfoObj}
            createAndSetMask={createAndSetMask}
          />

          <ImageList
            title='Reviewed Images'
            imageItems={imageItems.reviewed}
          />
        </div>
      </div>

      <NetListFooter
        segNetItems={segNetItems}
        requestSegNetTrainOnSelectedDataset={requestSegNetTrainOnSelectedDataset}
        segNetTrainConfig={segNetTrainConfig}
        handleSegNetTrainConfigChange={handleSegNetTrainConfigChange}
        handleSegNetTrainConfigSubmit={handleSegNetTrainConfigSubmit}
      />
    </main>
  );
}

export default SegmentationApp;