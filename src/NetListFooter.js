import { useState, useEffect, useRef } from 'react';

function NetListFooter(props) {
  const dropdownTrainConfig = useRef(null);
  const trainConfigForm = useRef(null);

  // const handleTrainConfigFormSubmit = (event) => {
  //   for (let el of event.target.elements) {
  //     console.log(`trainConfigForm.${el.id}: ${el.value}`);
  //   }
  // };

  useEffect(() => {
    if (dropdownTrainConfig !== null) {
      dropdownTrainConfig.current.addEventListener('hide.bs.dropdown', (e) => {
        trainConfigForm.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      });
    }
  }, [dropdownTrainConfig]);

  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container px-3 py-2">
        <div className="d-flex flex-wrap justify-content-start align-items-center py-3 my-0 border-top">
          <div className="d-flex flex-column col-md-1 d-flex align-items-center">
            <div className="mb-3 mb-md-0 text-black">Networks</div>
            <button type="button" className="btn btn-info" onClick={props.requestSegNetTrainOnSelectedDataset}>
              + Train
            </button>
            <div className="dropup" ref={dropdownTrainConfig}>
              <button
                id="dropup"
                type="button"
                className="btn btn-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Config...
              </button>
              <div className="dropdown-menu" aria-labelledby="dropupConfig">
                <form className="px-4 py-3" ref={trainConfigForm}>
                  <div className="form-floating mb-1">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      style={{ width: "200px" }}
                      name="numEpochs"
                      value={props.segNetTrainConfig.numEpochs}
                      onChange={props.handleSegNetTrainConfigChange}
                    />
                    <label htmlFor="numEpochsInput">Number of epochs</label>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex overflow-auto">
            { props.segNetItems }
          </div>
        </div>
      </div>
    </footer>
  )
}

export default NetListFooter;