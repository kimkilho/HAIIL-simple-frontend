import React from "react";
import styled from "styled-components"; 

const Label = styled.label`
  align-items: center;
  margin: 1px;
`;
const Div = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 2px;
  border: 1px solid #313c4e; 
  background-color: #2b3648;
  cursor: pointer; 
  transition: background-color 0.4s; 
  display: flex;
  justify-content: center;
  align-items:center;
  &:hover {
    border: 1.5px solid #1976d2; 
    color: #bbb;
  }
`;
const Input = styled.input`
  visibility: hidden;
  background-color: transparent;
  position: absolute;
  &:checked + ${Div} {
    background-color: #1976d2;
    color: #bbb;
    border-color: #1976d2;
  }
`;

export default class DrawButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: props.idx,
      icon: props.icon,
      checkedIdx: props.CheckedIdx,
    }; 
    console.log(this.state.checkedIdx, this.state.idx);
  }

  render() {
    const { idx } = this.state;
    return (
      <Label>
        <Input
          id={idx}
          value={idx}
          name="drawbutton"
          type="radio"
          //checked={this.state.checkedIdx == idx}
          onChange={(e) => this.props.click(this.state.idx)}
        />
        <Div>{this.props.icon}</Div>
      </Label>
    );
  }
}
