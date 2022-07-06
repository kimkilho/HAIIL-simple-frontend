import { Link } from "react-router-dom";
import "./App.css";
import styled from "styled-components";

const Img = styled.img`
  justify-content: center;
  text-align: center;
  display: block;
  margin: 50px auto 10px;
`;
const H1 = styled.h1` 
  text-align: center;
  display: block;
`;
const CustomLink = styled(Link)`
  text-decoration: none;
  color: black;
  text-align: center;
  display: block;
  font-weight: 500;
  width: 100px;
  &:hover {
    transform: scale(1.1);
    font-weight: 700;
    transition: transform 0.3s;
  }
`;
const Div = styled.div`
  display: flex;
  justify-content: center;
`;

function App() {
  return (
    <div>
      <Img src={require("./HAIIL.png")} alt="logo" />
      <H1>HAIIL testbed (minimal)</H1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Div>
          <CustomLink to="/classification">Classification</CustomLink>
          &nbsp;&nbsp;|&nbsp;&nbsp;{" "}
          <CustomLink to="/segmentation">Segmentation</CustomLink>
        </Div>
      </nav>
    </div>
  );
}

export default App;
