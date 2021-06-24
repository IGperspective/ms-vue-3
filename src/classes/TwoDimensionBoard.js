import CellData from "./CellData.js";

export default class TwoDimensionBoard extends Array {
  constructor(row, col) {
    super();
    let r = 0;
    for (; r < row; r++) {
      this[r] = [];
      let c = 0;
      for (; c < col; c++) {
        this[r][c] = new CellData(r, c)
        // this[r][c] = {value:0, open: false};
      }
    }
  }
  forEach2(callBack) {

    let r = 0;
    let l = this.length;
    for (; r < l; r++) {
      let c = 0;
      let w = this[r].length;
      for (; c < w; c++) {
        callBack(this[r][c])
      }
    }
  }
  forEach1(callBack) {
    let r = 0;
    let l = this.length;
    for (; r < l; r++) {
      callBack(this[r])
    }
  }
  getNeighbours(row, col) {
    let neighbours = [];
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (j == 0 && i == 0) {
          continue;
        } else if ((row + i) > -1 && (col + j) > -1 && (row + i) < this.length && (col + j) < this[0].length) {
          neighbours.push(this[row + i][col + j]);
        }
      }
    }
    return neighbours;
  }
  getCellById(id) {
    let cellRowCol = id.split("_");
    return this[cellRowCol[0]][cellRowCol[1]]
  }

}