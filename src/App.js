import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <img className="d-block text-center justify-content-center mx-auto mt-5 mb-3" src={require("./HAIIL.png")} alt="logo" />
      <h1 className="d-block text-center">HAIIL testbed (minimal)</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <div className="d-flex justify-content-center my-1"> 
          
          <a href="/classification" className="btn btn-outline-primary">Classification</a> 
         <div className="mx-2" style={{borderRight:"1px solid black", width:"0.1px", height:"auto"}}></div>
          <a href="/segmentation" className="btn btn-outline-primary">Segmentation</a>
        </div>
      </nav>
    </div>
  );
}

export default App;
