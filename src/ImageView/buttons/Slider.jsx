import React from "react";
import styled from "styled-components";

const Input = styled.input` 
  width: 150px;
  max-width: 150px;
  border: 1px solid red;
  display: block;
`;
  
function Slider({ min, max, defaultVal, setValue }) {
  function onChange(e) { 
    setValue(e.target.value);
  } 
  return (
    <Input
      type="range"
      min={min}
      max={max}
      step="1"
      defaultValue={defaultVal}
      onChange={onChange.bind(this)}  
    />
  );
}
export default Slider;
