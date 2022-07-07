const sendGETRequestAndGetJsonResponseData = async (url, caching = true) => {
  const headers = { method: 'GET' };
  if (caching === false) headers.cache = 'no-store';
  const response = await fetch(url, headers);

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
}

const readDatasetObjs = async () => {
  return await sendGETRequestAndGetJsonResponseData(
    '/api/datasets/', 'GET',
  );
};

const readDatasetObj = async (datasetId) => {
  return await sendGETRequestAndGetJsonResponseData(
    `/api/datasets/${datasetId}`, 'GET',
  );
};

const readSegNetObjs = async (datasetId) => {
  return await sendGETRequestAndGetJsonResponseData(
    `/api/datasets/${datasetId}/segnets/`, 'GET',
  );
};

const readPredMaskObjs = async (segNetId, imageId = null) => {
  if (imageId !== null) {
    return await sendGETRequestAndGetJsonResponseData(
      `/api/segnets/${segNetId}/images/${imageId}/predmasks/`, 'GET',
    );
  } else {
    return await sendGETRequestAndGetJsonResponseData(
      `/api/segnets/${segNetId}/predmasks/`, 'GET',
    );
  }
};

const readImageObjs = async (datasetId, task = 'classification', reviewed = false) => {
  // task: {'classification', 'segmentation'}
  if (!['classification', 'segmentation'].includes(task)) {
    throw new Error('Invalid input for task argument.');
  }
  const requestUrlQuery = `task=${task}&reviewed=${reviewed ? 'true' : 'false'}`;

  return await sendGETRequestAndGetJsonResponseData(
    `/api/datasets/${datasetId}/images?${requestUrlQuery}`, 'GET',
  );
};

const readImageBlob = async (imageId) => {
  const response = await fetch(
    `/api/images/${imageId}/file`,
    {
      method: 'GET',
      cache: 'default',    // NOTE: May have to be set to 'no-store' to prevent the browser from caching
    },
  );

  if (response.status === 200) {
    return await response.blob();
  } else {
    throw new Error('Unable to fetch response body.');
  }
};

const readLabelObjs = async (imageId) => {
  return await sendGETRequestAndGetJsonResponseData(
    `/api/images/${imageId}/labels/`, 'GET',
  );
};

const readMaskObjs = async (imageId) => {
  return await sendGETRequestAndGetJsonResponseData(
    `/api/images/${imageId}/masks/`, 'GET',
  );
};

const createLabel = async (datasetName, domainName, imageFilename, label) => {
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
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
}

const createMask = async (datasetName, domainName, imageFilename, mask) => {
  const maskedAt = Date.now();    // unix timestamp (in milliseconds)
  const data = {
    dataset_name: datasetName, domain_name: domainName, image_filename: imageFilename,
    mask: mask, masked_at: maskedAt,
  };

  const response = await fetch(
    '/api/masks',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
}

const requestSegNetTrain = async (datasetName, domainName, predOutputType = 'mask', numEpochs = 10) => {
  const data = {
    dataset_name: datasetName, domain_name: domainName, pred_output_type: predOutputType, num_epochs: numEpochs,
  };
  const response = await fetch(
    '/api/segnets/train',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  return await response.json();
};

export { readDatasetObjs, readDatasetObj, readImageObjs, readImageBlob,
         readLabelObjs, readMaskObjs, createLabel, createMask,
         readSegNetObjs, readPredMaskObjs, requestSegNetTrain, };