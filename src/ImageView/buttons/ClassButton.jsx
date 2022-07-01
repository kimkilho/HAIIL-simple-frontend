import React from "react"; 
import styled from "styled-components"; 


const Div = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s;
  color: #eee;
  font-size: 14px;
  background-color: red;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid rgb(0, 153, 255);
  }
`;
const Input = styled.input`
  visibility: hidden;
  background-color: transparent;
  position: absolute;
  &:checked + ${Div} {
    transform: scale(1);
    border: 2px solid rgb(0, 153, 255);
  } 
`; 
const Label = styled.label`
  align-items: center;
  margin: 3px 4px 0 0;
`;

export default class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classIndex: props.classIndex,
      classColor: props.classColor,
    };
  }
 
//   handleChange = (e) => { 
//     console.log(e.target); 
//   };

  render() {
    const { classIndex, classColor } = this.state;
    return (
      <Label>
        <Input
          id={classIndex}
          value={classIndex}
          name="classColor" //이게 맞아야 같은 그룹으로 엮임
          type="radio" 
        //   onChange={this.handleChange.bind(this)}
          onChange={(e) => this.props.click(this.state.classIndex)}
        />
        <Div style={{ backgroundColor: classColor }}></Div>
      </Label>
    );
  }
}
