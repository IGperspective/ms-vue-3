<template>
  <div class="ms-board">
    <div
      class="ms-cells"
      :style="{
        minWidth: minWidth + 'px',
        width: minWidth + 'px',
        height: minHeight + 'px',
      }"
    >
      <div class="ms-cells__row row -is-on" v-for="(row, r) in board" :key="r">
        <MsCell
          v-for="cell in row"
          :key="cell.id"
          :value="cell.value"
          :open="cell.isOpen"
          :quickReveal="cell.quickReveal"
          :interactive="cell.isInteractive"
          :marker="cell.marker"
          @open="updateBoard(cell)"
          @removeMarker="removeMarker(cell)"
          @toggleMarker="toggleMarker(cell)"
          @quickReveal="revealAdjacentCells(cell.row, cell.col)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MsCell from "./MsCell.vue";
import TwoDimensionBoard from "../classes/TwoDimensionBoard.js";
var offset = {
  h: 106 + 120 * !(
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0),
  w: 22,
};
export default {
  components: { MsCell },
  props: {
    level: {
      type: Number,
      default: 0.125,
    },
    size: {
      type: String,
      default: "s",
    },
  },
  data() {
    return {
      isOn: false,
      board: null,
      mines: 0,
      flags: 0,
      revealedCells: 0,
      int: true,
      rows: 9,
      cols: 9
    };
  },

  emits: {
    firstTouch: null,
    fieldCleared: null,
    gameOver: null,
    gameWin: null,
    updateCounter: null,
  },

  created() {
    this.board = new TwoDimensionBoard(this.rows, this.cols);
    this.mines = this.setBoardValues(this.level);
    this.$emit("updateCounter", this.mines - this.flags);
  },
  mounted() {
    const restart = () => {
      this.restart();
      window.removeEventListener("resize", restart);
    };
    window.addEventListener("orientationchange", () => {
      if (this.size == "sc" && !this.isOn) {
        window.addEventListener("resize", restart);
      }
    });
  },
  computed: {
    winConditions() {
      if (this.revealedCells == this.cols * this.rows - this.mines) {
        return true;
      } else {
        return false;
      }
    },
    minWidth() {
      return this.cols * 32;
    },
    minHeight() {
      return this.rows * 32;
    },
    flagsCount() {
      return this.mines - this.flags;
    },
  },

  watch: {
    size: function (mow, was) {
      this.restart();
    },
    level: function (mow, was) {
      this.reset();
    },
    flags: function (mow, was) {
      this.$emit("updateCounter", this.mines - this.flags);
    },
    mines: function (mow, was) {
      this.$emit("updateCounter", this.mines - this.flags);
    },
  },

  methods: {
    end() {
      let correctFlags = 0;
      this.board.forEach2((cell) => {
        // remove hover
        cell.isInteractive = false;
        if (cell.marker.flag && cell.value == 9) {
          correctFlags++;
          // reveal if flagged correctrly
          cell.isOpen = true;
        }
      });
      this.$emit("updateCounter", this.mines - correctFlags);
      this.$emit("gameOver");
    },
    win() {
      this.board.forEach2((cell) => {
        // remove hover
        cell.isInteractive = false;
        if (cell.value == 9) {
          // put marker by defoult
          cell.marker.flag = true;
          // reveal all bombs
          cell.isOpen = true;
        }
      });
      this.$emit("gameWin");
    },
    calculateRowsCols() {
      switch (this.size) {
        case "s":
          this.rows = this.cols = 9;
          break;
        case "m":
          this.rows = this.cols = 16;
          break;
        case "l":
          this.rows = 16;
          this.cols = 30;
          break;
        case "sc":
         this.rows = Math.floor(
            (Math.min(window.innerHeight, 1024) - offset.h ) / 32
          );
          this.cols = Math.floor(
            (Math.min(window.innerWidth, 1024) - offset.w) / 32
          );
          break;
        default:
          this.rows = this.cols = 9;
      }
    },
    restart() {
      this.calculateRowsCols();
      this.board = new TwoDimensionBoard(this.rows, this.cols);
      this.reset();
    },
    reset() {
      console.log("reset", window.innerHeight);
      this.board.forEach2((cell) => {
        cell.reset();
      });
      this.mines = this.setBoardValues(this.level);
      this.flags = 0;
      this.isOn = false;
      this.revealedCells = 0;
    },

    getCellbyEventTarget(event) {
      //event.stopPropagation();
      console.log(this.board.getCellById(event.target.id));
    },

    removeMarker(cell) {
      this.flags += cell.removeMarker();
      window?.navigator?.vibrate(10);
      this.resetQuickRevealAround(cell);
    },
    toggleMarker(cell) {
      this.flags += cell.toggleMarker();
      window?.navigator?.vibrate(20);
      this.resetQuickRevealAround(cell);
    },

    updateBoard(cell) {
      if (!this.isOn) {
        this.firstReveal(cell);
      }
      this.revealBoardCell(cell);
    },

    revealBoardCell(cell) {
      cell.isOpen = true;
      window?.navigator?.vibrate([25, 50, 25]);
      this.revealedCells++;
      if (cell.value == 9) {
        window?.navigator?.vibrate(50);
        return this.end();
      } else if (this.winConditions) {
        return this.win();
      } else if (cell.value == 0) {
        this.revealEmptyCells(cell);
      } else if (this.flags > 0) {
        this.updateQuickRevealAround(cell);
      }
    },

    revealEmptyCells(cell) {
      this.board.getNeighbours(cell.row, cell.col).forEach((cell) => {
        //when reveal adjacent around empty cell we remove any marker
        if (!cell.isOpen) {
          if (cell.isMarked) {
            this.removeMarker(cell);
          }
          this.revealBoardCell(cell);
        } else if (cell.quickReveal) {
          this.setQuickReveal(cell);
        }
      });
    },

    firstReveal(cell) {
      if (cell.value != 0) {
        this.board.forEach2((cell) => {
          cell.lightReset();
        });
        this.mines = this.setBoardValues(this.level, cell);
        this.isOn = true;
      } else {
        this.isOn = true;
      }
      this.$emit("firstTouch");
    },

    // when toggle marker
    resetQuickRevealAround(cell) {
      this.board.getNeighbours(cell.row, cell.col).forEach((cell) => {
        if (cell.isOpen && cell.value > 0 && cell.value < 9) {
          this.setQuickReveal(cell);
        }
      });
    },
    // when reveal cell with number
    updateQuickRevealAround(cell) {
      this.board.getNeighbours(cell.row, cell.col).forEach((adjacentCell) => {
        if (adjacentCell.quickReveal) {
          this.setQuickReveal(adjacentCell);
        }
        if (adjacentCell.marker.flag) {
          this.setQuickReveal(cell);
        }
      });
    },

    //if flags around open cell == this cell number
    //than we set extra functionality to reveal all closed cells around
    setQuickReveal(cell) {
      let flag = 0;
      let closed = 0;
      this.board.getNeighbours(cell.row, cell.col).forEach((cell) => {
        if (cell.marker.flag) {
          flag++;
        }
        if (!cell.isOpen && !cell.marker.flag) {
          closed++;
        }
      });
      if (cell.value == flag && closed > 0) {
        cell.quickReveal = true;
      } else {
        cell.quickReveal = false;
      }
    },

    revealAdjacentCells(r, c) {
      this.board[r][c].quickReveal = false;
      this.board.getNeighbours(r, c).forEach((cell) => {
        //for quick reveal ajacents we do not open flaged cells
        if (!cell.isOpen && !cell.marker.flag) {
          this.revealBoardCell(cell);
        }
      });
    },
    setBoardValues(level, exclude = false) {
      // generate random ids and place mines (value "9")
      let ignoredIds = [];
      if (exclude) {
        let ignored = [];
        if (level == 0.125) {
          ignored = this.board.getNeighbours(exclude.row, exclude.col);
        }
        ignored.push(exclude);
        ignoredIds = ignored.map((cell) => {
          return cell.row + "_" + cell.col;
        });
      }
      let j = 0;
      let minesCount = Math.floor(this.rows * this.cols * level);
      for (; j < minesCount; ) {
        let randomRow = Math.floor(Math.random() * this.rows);
        let randomCol = Math.floor(Math.random() * this.cols);
        if (ignoredIds.includes(randomRow + "_" + randomCol)) {
          continue;
        }
        if (this.board[randomRow][randomCol].value == 9) {
          // if already mined then get another random id
          continue;
        } else {
          this.board[randomRow][randomCol].value = 9;
          // set values to the board neighbouring the mine
          this.board.getNeighbours(randomRow, randomCol).forEach((cell) => {
            if (cell.value != 9) cell.value++;
          });
          j++;
        }
      }
      return minesCount;
    },
  },
};
</script>

<style>
.ms-board {
  display: grid;
  max-width: 100%;
  overflow: auto hidden;
  width: 100%;
  border-style: inset;
  border-width: 3px;
  border-color: #4a5665;
  background-color: #393939;
  height: calc(100% - 86px);
}

.ms-board::-webkit-scrollbar-thumb {
  background: linear-gradient(to top left, #4d9236, #7ac943);
  border: 0px solid transparent;
}

.ms-board::-webkit-scrollbar-corner {
  background: transparent;
}

.ms-board::-webkit-scrollbar-track {
  background: #393939;
  border: 0px none #ffffff;
}

.ms-board::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

.ms-board::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.row:after,
.row:before {
  content: "";
  display: table;
  clear: both;
}

.ms-cells {
  background-color: var(--ms-cell--open);
  margin: auto;
}

.rotate {
  transition: transform 1s ease-in-out;
}

.rotate:hover {
  transform: rotate(1080deg);
  transition: transform 1s ease-in-out;
}
</style>