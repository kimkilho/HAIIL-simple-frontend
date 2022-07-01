import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import ImageList from './ImageList';
import ImageMaskReviewScreen from './ImageMaskReviewScreen';
import ModelListFooter from './ModelListFooter';
import {
  readDatasetObjs, readImageObjs, readImageBlob, readMaskObjs, createMask,
} from './requests';

const bootstrap = require('bootstrap');
const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => {
  new bootstrap.Tooltip(tooltipTriggerEl);
});

function SegmentationApp() {
  const [datasetObjs, setDatasetObjs] = useState([]);
    // [ { id: <int>, name: <string>, domain: <string|null>, classes: <object> } ]
  const [datasetObjIdx, setDatasetObjIdx] = useState(0);    // int
  const [imageListsNestedObj, setImageListsNestedObj] = useState({});
    /*
      {
        <str>: {
          reviewed: [ { id: <int>, dataset_id: <int>, gt_label: <int|null>, gt_mask: <int|null> } ],
          nonreviewed: [ { id: <int>, dataset_id: <int>, gt_label: <int|null>, gt_mask: <int|null> } ],
        }
      }
     */
  const [imageItems, setImageItems] = useState({ reviewed: [], nonreviewed: [] });
    // { reviewed: [ <HTML element> ], nonreviewed: [ <HTML element> ] }
  const [imageBeingReviewedInfoObj, setImageBeingReviewedInfoObj] = useState(
    { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null, mask: {} }
  );
    // { imageset: <string>, imageItemIdx: <int>, imageFilename: <string>, imageBlob: <Blob>, mask: <object> }

  const readAndSetDatasetObjs = async () => {
    setDatasetObjs(await readDatasetObjs());
  }

  const readAndSetImageListsNestedObj = async (datasetName, domainName) => {
    const datasetKey = `${datasetName}-${domainName}`;
    const imageListsObj = { reviewed: null, nonreviewed: null };

    for (let imageset of ['reviewed', 'nonreviewed']) {
      const reviewed = imageset === 'reviewed';
      imageListsObj[imageset] = await readImageObjs(datasetName, domainName, 'segmentation', reviewed);
    }

    setImageListsNestedObj({ ...imageListsNestedObj, [datasetKey]: imageListsObj })
  };

  const flagImageObjAsReviewInImageListsNestedObj = async (datasetName, domainName, imageFilename) => {
    const datasetKey = `${datasetName}-${domainName}`;
    const imageListsObj = imageListsNestedObj[datasetKey];
    const imageObj = imageListsObj.nonreviewed.filter(obj => obj.name === imageFilename);
    setImageListsNestedObj({ ...imageListsNestedObj,
      [datasetKey]: {
        nonreviewed: imageListsObj.nonreviewed.filter(obj => obj.name !== imageFilename),    // removal
        reviewed: imageListsObj.reviewed.concat(imageObj),    // addition
      },
    });
  };

  const createAndSetMask = async (datasetName, domainName, imageFilename, mask) => {
    const _maskObj = await createMask(datasetName, domainName, imageFilename, mask);
    setImageBeingReviewedInfoObj({ ...imageBeingReviewedInfoObj, mask: _maskObj.mask });

    // Flag the image as 'reviewed'
    flagImageObjAsReviewInImageListsNestedObj(datasetName, domainName, imageFilename);
  };

  const handleImageItemOnClick = async (imageset, imageFilename, i) => {
    const { id, name, domain, classes } = datasetObjs[datasetObjIdx];
    const imageBlob = await readImageBlob(name, domain, imageFilename);
    const maskObjs = await readMaskObjs(name, domain, imageFilename);

    setImageBeingReviewedInfoObj({ ...imageBeingReviewedInfoObj,
      imageset: imageset, imageItemIdx: i,
      imageFilename: imageFilename, imageBlob: imageBlob,
      mask: maskObjs.length > 0 ? maskObjs[maskObjs.length-1].mask : [],
    });
  }

  const clearImageBeingReviewedInfoObj = () => {
    setImageBeingReviewedInfoObj(
      { imageset: '', imageItemIdx: -1, imageFilename: '', imageBlob: null, mask: {} }
    );
  };

  useEffect(() => {
    if (datasetObjs.length === 0) {
      readAndSetDatasetObjs();
    } else {
      const { id, name, domain, classes } = datasetObjs[datasetObjIdx];
      const datasetKey = `${name}-${domain}`;

      if (imageListsNestedObj[datasetKey] === undefined) {
        readAndSetImageListsNestedObj(name, domain);
      } else {
        const tempImageItems = { reviewed: [], nonreviewed: [] };
        ['nonreviewed', 'reviewed'].forEach((imageset) => {
          imageListsNestedObj[datasetKey][imageset].forEach((imageObj, i) => {
            const imageFilename = imageObj.name;
            const score = 0.999;    // FIXME
            let activeFlag;
            if (imageBeingReviewedInfoObj.imageFilename === imageObj.name)
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
  }, [datasetObjs, datasetObjIdx, imageListsNestedObj, imageBeingReviewedInfoObj]);

  return (
    <main>
      <Header
        datasetObjs={datasetObjs}
        datasetObjIdx={datasetObjIdx}
        setDatasetObjIdx={setDatasetObjIdx}
        clearImageBeingReviewedInfoObj={clearImageBeingReviewedInfoObj}
      />
      <div className="container">
        <div className="d-flex flex-nowrap">
          <ImageList
            title='Non-reviewed Images'
            imageItems={imageItems.nonreviewed}
          />

          <ImageMaskReviewScreen
            datasetBeingReviewedObj={datasetObjs.length === 0 ? null : datasetObjs[datasetObjIdx]}
            imageBeingReviewedInfoObj={imageBeingReviewedInfoObj}
            createAndSetMask={createAndSetMask}
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

export default SegmentationApp;
