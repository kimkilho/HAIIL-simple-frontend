import { useState, useEffect } from 'react';

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
        opts.html = true;
      }
      return new bootstrap.Popover(el, opts);
    });
  }, []);

  return (
    <div className="container">
      <div className="px-3 py-2">
        <footer className="d-flex flex-wrap justify-content-start align-items-center py-3 my-0 border-top">
          <div className="d-flex flex-column col-md-1 d-flex align-items-center">
            <div className="mb-3 mb-md-0 text-black">Networks</div>
            <button type="button" className="btn btn-info" onClick={props.requestSegNetTrainOnSelectedDataset}>
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
            <div id="popover-content" className="d-none">
              <div style={{ width: "100px" }}>
                <form>
                  <div>
                    <label htmlFor="inputNumEpochs" className="form-label">num_epochs</label>
                    <input type="number" id="numEpochs" className="form-control" />
                    <div>Test form</div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          { props.segNetItems }
        </footer>
      </div>
    </div>
  )
}

export default NetListFooter;