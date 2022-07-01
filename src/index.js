import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import ClassificationApp from './ClassificationApp';
import SegmentationApp from './SegmentationApp';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/classification" element={<ClassificationApp />} />
      <Route path="/segmentation" element={<SegmentationApp />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);