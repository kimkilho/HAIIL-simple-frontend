import { useState, useEffect } from 'react';

function ImageList(props) { 
  const [orderOption, setOrderOption] = useState([]); 
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(0); 
  const sortOptionNames = ["Descending","Ascending"];

  useEffect(() => {
    var tempoptions = [];
    for(let i=0;i<sortOptionNames.length;i++){ 
      const option =
        <li key={i}>
          <a className={"dropdown-item" + (selectedOptionIdx === i? ' active' : '')}
             href="#" onClick={() => handleOrderOptionOnClick(i)}>
            {sortOptionNames[i]} 
          </a>
        </li>;
      tempoptions.push(option);
    }
    setOrderOption(tempoptions); 

    props.sortOptionChanged(selectedOptionIdx, props.title); 

  }, [selectedOptionIdx]);

  const handleOrderOptionOnClick = (idx) => {
    setSelectedOptionIdx(idx);  
  } 
 

  return (
    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style={{width: '280px', height: '720px'}}>
      <div className="dropdown text-end">
          <button id="dropdownOrderOption" className="btn btn-info dropdown-toggle mt-1" type="button" style={{width: "100%", height:"100%"}}
                  data-bs-toggle="dropdown" aria-expanded="false"> 
            Metric Order : { sortOptionNames[selectedOptionIdx] } &nbsp;
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownOrderOption" style={{width: "100%"}}>
            { orderOption }
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