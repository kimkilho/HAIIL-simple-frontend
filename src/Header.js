function Header(props) {
  const handleDatasetOnClick = (i) => {
    props.setDatasetObjIdx(i);
  }

  const datasetItems = [];
  props.datasetObjs.forEach((datasetObj, i) => {
    const datasetItem =
      <li key={i}>
        <a className={"dropdown-item" + (props.datasetObjIdx === i ? ' active' : '')}
           onClick={() => handleDatasetOnClick(i)}>
          { datasetObj.name + ' - ' + datasetObj.domain }
        </a>
      </li>;
    datasetItems.push(datasetItem);
  })

  console.log(props.datasetObjs);
  const selectedDatasetName = props.datasetObjs.length === 0 ?
                                'Datasets' :
                                props.datasetObjs[props.datasetObjIdx].name + ' - ' +
                                props.datasetObjs[props.datasetObjIdx].domain

  return (
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
                { selectedDatasetName }
                {/*{ props.datasetObjs[props.datasetObjIdx] }*/}
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownDataset">
                { datasetItems }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;