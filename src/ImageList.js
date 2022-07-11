import { useState, useEffect } from 'react';

function ImageList(props) { 
  const [sortOption, setSortOption] = useState([]); 
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0); 
  const sortOptionNames = ["Option1","Option2","Option3"];

  useEffect(() => {
    var tempoptions = [];
    for(let i=0;i<sortOptionNames.length;i++){ 
      const option =
        <li key={i}>
          <a className={"dropdown-item" + (selectedOptionIdx === i? ' active' : '')}
             href="#" onClick={() => handleSortOptionOnClick(i)}>
            {sortOptionNames[i]}
          </a>
        </li>;
      tempoptions.push(option);
    }
    setSortOption(tempoptions); 

    props.sortOptionChanged(selectedOptionIdx); 

  }, [selectedOptionIdx]);

  const handleSortOptionOnClick = (idx) => {
    setSelectedOptionIdx(idx);  
  } 
 

  return (
    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
      <div className="dropdown text-end">
          <button id="dropdownDataset" className="btn btn-info dropdown-toggle mt-1" type="button" style={{width: "100%"}}
                  data-bs-toggle="dropdown" aria-expanded="false"> 
            Sort : { sortOptionNames[selectedOptionIdx] } 
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownDataset" style={{width: "100%"}}>
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