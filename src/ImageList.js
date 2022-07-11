import { useState, useEffect } from 'react';

function ImageList(props) {
  const [selectedOption, setSelectedOption] = useState(); 
  const [sortOption, setSortOption] = useState([]); 
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0); 
 
  const handleDatasetOnClick = (idx) => {
    setSelectedOptionIdx(idx); 
  }
  useEffect(() => {

    var tempoptions = [];
    for(let i=0;i<3;i++){ 
      const option =
        <li key={i}>
          <a className={"dropdown-item" + (selectedOption === selectedOptionIdx ? ' active' : '')}
             href="#" onClick={() => handleDatasetOnClick(selectedOptionIdx)}>
            {"option" + ' - ' + i}
          </a>
        </li>;
      tempoptions.push(option);
    }
    setSortOption(tempoptions); 
  }, []);

  return (
    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
      <div className="dropdown text-end">
          <button id="dropdownDataset" className="btn btn-secondary dropdown-toggle" type="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
            { selectedOption } 
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownDataset">
            { sortOption }
          </ul>
        </div>
      <a className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
        <span className="fs-5 fw-semibold">{ props.title }</span>
      </a>
      <div className="list-group list-group-flush border-bottom scrollarea">
        { props.imageItems }
      </div>
    </div>
  )
}

export default ImageList;