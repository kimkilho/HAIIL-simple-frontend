const readDatasetObjs = async () => {
  const response = await fetch(
    '/api/datasets/',
    { method: 'GET' }
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
};

const readImageObjs = async (datasetName, domainName, task = 'classification', reviewed = false) => {
  // task: {'classification', 'segmentation'}
  if (!['classification', 'segmentation'].includes(task)) {
    throw new Error('Invalid input for task argument.');
  }

  const requestUrlQuery = `?task=${task}&reviewed=${reviewed ? 'true' : 'false'}`;
  const response = await fetch(
    `/api/datasets/${datasetName}/domains/${domainName}/images/${requestUrlQuery}`,
    { method: 'GET' },
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
};

const readImageBlob = async (datasetName, domainName, imageFilename)  => {
  const response = await fetch(
    `/api/datasets/${datasetName}/domains/${domainName}/images/${imageFilename}`,
    { method: 'GET' },
  );

  if (response.status === 200) {
    return await response.blob();
  } else {
    throw new Error('Unable to fetch response body.');
  }
};

const readLabelObjs = async (datasetName, domainName, imageFilename) => {
  const response = await fetch(
    `/api/datasets/${datasetName}/domains/${domainName}/images/${imageFilename}/labels/`,
    { method: 'GET' },
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
};

const readMaskObjs = async (datasetName, domainName, imageFilename) => {
  const response = await fetch(
    `/api/datasets/${datasetName}/domains/${domainName}/images/${imageFilename}/masks/`,
    { method: 'GET' },
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error('Unable to fetch response body.');
  }
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
    console.log("createMask",data.mask);
    var d = JSON.stringify(data);
  //  console.log("createMask2",d);

  //  var d2 = JSON.parse(d);
  //  console.log("createMask3",d2);

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

export { readDatasetObjs, readImageObjs, readImageBlob,
         readLabelObjs, readMaskObjs, createLabel, createMask, };