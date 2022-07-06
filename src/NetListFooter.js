import { useState, useEffect } from "react";

function NetListFooter(props) {
  useEffect(() => {
    // Enable popovers
    const bootstrap = require('bootstrap');
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (el) {
      let opts = {
        animation: false,
      }
      if (el.hasAttribute('data-bs-content-id')) {
        opts.content = document.getElementById(el.getAttribute('data-bs-content-id')).innerHTML;
        console.log("opts.content",opts.content);
        opts.html = true;
      } 
      return new bootstrap.Popover(el, opts);
    });
  }, []); 

  return (
    <div className="container">
      <div className="px-3 py-2">
        <footer className="d-flex justify-content-start align-items-center py-3 my-0 border-top">
          <div className="d-flex flex-column col-md-1 align-items-center" style={{backgroundColor:"transparent"}}>
            <div className="m-auto mb-3 mb-md-0 text-black fs-5 fw-semibold">Networks</div>
            <button
              type="button"
              className="btn btn-info"
              onClick={props.requestSegNetTrainOnSelectedDataset}
            >
              + Train
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-toggle="popover"
              data-bs-placement="right"
              data-bs-content-id="popover-content"
            >
              Config...
            </button>
            <div className="popover d-none" role="tooltip">
              <div className="popover-arrow"></div>
              <h3 className="popover-header"></h3>
              <div className="popover-body">
                <div id="popover-content" >
                  <div style={{ width: "100px" }}>
                    <form>
                      <div>
                        <label htmlFor="inputNumEpochs" className="form-label">
                          num_epochs
                        </label>
                        <input
                          type="number"
                          id="numEpochs"
                          className="form-control"
                        />
                        <div>Test form</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div> 
          </div>
          <div className="d-flex overflow-auto" style={{width: "auto"}}> 
          {props.segNetItems}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default NetListFooter;
