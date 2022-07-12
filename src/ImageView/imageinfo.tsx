export class ImgClass {
  index = 0;
  name: string;
  classColor: string;

  constructor(_index, _name, _color) {
    this.index = _index;
    this.name = _name;
    this.classColor = _color;
  }
} 
export class Blob {
  public no: number;
  public classId: number;
  public classColor: string;
  public type: string; // polyline, polygon
  public thickness: number; // if use polygon thickness is 1
  public data: number[][]; // point array [[<int>, <int>],[<int>, <int>], ... , [<int>, <int>]] 

  public constructor(...array: any[]) {
    if (array.length === 1) {
      Object.assign(this, array[0]);
    } else {
      this.no = array[0];
      this.classId = array[1];
      this.classColor = array[2];
      this.type = array[3];
      if (this.type === "polygon") this.thickness = 1;
      else if (this.type === "polyline") this.thickness = array[4];
      else {
        this.thickness = 1;
      }
      this.data = []; //[5]

      if (array[6]) {
        Array.from(array[6].points).forEach((pt) => {
          this.data.push([(pt as SVGPoint).x, (pt as SVGPoint).y]);
        });
      } else this.data = array[5];
    }
  }
  
  public convertSVG() {
    var poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    poly.style.strokeLinejoin = "round"; 
    poly.style.strokeWidth = this.thickness.toString(); 
    poly.style.shapeRendering = "crispEdges";
    poly.style.strokeLinecap = "round";
    poly.style.stroke = this.classColor;

    switch (this.type) {
      case "polyline":
        poly.style.strokeOpacity = "0.5";
        poly.style.fill = "none";
        poly.style.fillOpacity = "0.5";
        break;
      case "polygon":
        poly.style.strokeOpacity = "1";
        poly.style.fill = this.classColor;
        poly.style.fillOpacity = "0.4";
        break;
      case "predict":
        poly.style.strokeOpacity = "1";
        poly.style.fill = this.classColor;
        poly.style.fillOpacity = "0.3";
        poly.style.strokeDasharray = "3 3"; 
        break;
    }
 
    var points = poly.getAttribute("points");
    this.data.forEach(val => {
      var pt = `${val[0]},${val[1]} `;
      if (points === null) points = pt;
      else points += pt;
    }) 
    poly.setAttributeNS(null, "points", points ?? ""); 
    return poly;
  }
}
 