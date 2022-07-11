import React from "react";
import styled from "styled-components";

const Input = styled.input` 
  width: 150px;
  max-width: 150px; 
  display: block; 
  margin: 5px;
`;
  
function Slider({ min, max, defaultVal, setValue }) {
  function onChange(e) { 
    setValue(e.target.value);
  } 
  return (
    <Input
      //className="form-range align-self-center"
      type="range"
      min={min}
      max={max}
      step="1"
      defaultValue={defaultVal}
      style={{width: "150px"}}
      onChange={onChange.bind(this)}  
    />
  );
}
export default Slider;
