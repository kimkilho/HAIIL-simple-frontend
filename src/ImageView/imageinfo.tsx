export default class ImageInfo {
  img: any;
  name: string;
  class: ImgClass;
  label: Label;
  imgWidth: number;
  imgHeight: number;

  constructor(_name, _w, _h) {
    //this.file = _filepath;
    //this.img = _img; //현재는 일단 파일경로, 추후엔 다른 정보로 대체?
    this.name = _name;
    //this.class = undefined;
    this.label = new Label();
    this.imgWidth = _w;
    this.imgHeight = _h;
  }
}

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

class Label {
  blobs = [];
}

export class Blob {
  public no: number;
  public classId: number;
  public classColor: string;
  public type: string; // polyline, polygon
  public thickness: number; // if use polygon thickness is 1
  public data: number[][]; // point array [[<int>, <int>],[<int>, <int>], ... , [<int>, <int>]]

  // public constructor(obj);
  // public constructor(
  //   no: number,
  //   classId: number,
  //   classColor: string,
  //   type: string,
  //   thickness: number,
  //   data: number[][],
  //   svg: any
  // );

  public constructor(...array: any[]) {
    if (array.length === 1) {
      Object.assign(this, array[0]);
      console.log("형변환 제대로됐나 확인",this);
    } else {
      this.no = array[0];
      this.classId = array[1];
      this.classColor = array[2];
      this.type = array[3];
      this.thickness = this.type === "polygon" ? 1 : array[4];
      this.data = []; //[5]

      if (array[6]) {
        Array.from(array[6].points).forEach((pt) => {
          this.data.push([(pt as SVGPoint).x, (pt as SVGPoint).y]);
        });
      } else this.data = array[5];
      
      console.log("제대로됐나 확인2",this);
    }
  }
  // constructor(
  //   no?: number,
  //   classId?: number,
  //   classColor?: string,
  //   type?: string,
  //   thickness?: number,
  //   data?: number[][],
  //   svg?: any,
  //   obj?: object
  // ) {

  //   if (obj !== undefined) {
  //     Object.assign(this, obj);
  //     console.log("제대로됐나 확인",this);
  //   } else {
  //     this.no = no ?? 0;
  //     this.classId = classId ?? 0;
  //     this.classColor = classColor ?? "black";
  //     this.type = type ?? "polyline";
  //     this.thickness = thickness ?? 1;
  //     this.data = [];

  //     if (svg) {
  //       Array.from(svg.points).forEach((pt) => {
  //         this.data.push([(pt as SVGPoint).x, (pt as SVGPoint).y]);
  //       });
  //     } else this.data = data ?? [];
      
  //     console.log("제대로됐나 확인2",this);
  //   } 
  // }

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
    poly.style.fillOpacity = ".3";

    switch (this.type) {
      case "polyline":
        poly.style.strokeOpacity = "0.5";
        poly.style.fill = "none";
        break;
      case "polygon":
        poly.style.strokeOpacity = "1";
        poly.style.fill = this.classColor;
        break;
    }

    //var poly = drawingObjs[drawingObjs.length - 1];
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

function pt(pt: any, arg1: (SVGPoint: any) => void) {
  throw new Error("Function not implemented.");
}
// export class BlobData {
//   type: string; //"Brush", "Polygon"
//   strokeThickness: number;
//   classIdx: number;
//   data: any;
//   constructor(_type, _strokethickness, _classidx, _data) {
//     this.type = _type;
//     this.strokeThickness = parseInt(_strokethickness);
//     this.classIdx = parseFloat(_classidx);
//     this.data = _data;
//   }
// }
