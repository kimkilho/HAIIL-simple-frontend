import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div>
      <h1>HAIIL testbed (minimal)</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/classification">Classification</Link> |{" "}
        <Link to="/segmentation">Segmentation</Link>
      </nav>
    </div>
  );
}

export default App;
