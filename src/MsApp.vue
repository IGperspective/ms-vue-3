<template>
  <div class="ms-game" id="ig-game" :state="game">
    <div class="ms-game__border-block">
      <div class="ms-settings">
        <!-- select size-->
        <div class="ms-flex--around">
          <label for="ms-size">size</label>
          <select
            v-model="selectedSize"
            name="size"
            id="ms-size"
            @change="resetTimer()"
          >
            <option v-for="s in sizes" :value="s.value" :key="s">
              {{ s.text }}
            </option>
          </select>
        </div>
        <!-- select level-->
        <div class="ms-flex--around">
          <label for="ms-level">level</label>
          <select
            v-model="selectedLevel"
            name="level"
            id="ms-level"
            @change="resetTimer()"
          >
            <option v-for="l in levels" :value="l.value" :key="l">
              {{ l.text }}
            </option>
          </select>
        </div>

        <!-- show controls button-->
        <div class="ms-flex--around">
          <fullScreenButton target="ig-game" />
          <Controls target="config-menu" />
        </div>
        <!-- controls message-->
        <div id="config-menu">
          <div class="ms-board__inner">
            <h2>Minesweeper Game Controls</h2>
            <ul>
              <li>Short-Tap - reveal cell</li>
              <li>Long-Tap - place marker</li>
              <li>Double-Tap - reveal adjacent</li>
            </ul>
            <ul>
              <li>Left-Click - reveal cell</li>
              <li>Right-Click - place marker</li>
              <li>Double-Click - reveal adjacent</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- display -->
      <div id="ms-display" class="ms-display">
        <Timer ref="msTimer" />
        <button class="ms-restart-button" @click="resetBoard(), resetTimer()" />
        <span id="ms-counter" class="ms-display-window">{{ minesLeft }}</span>
      </div>
      <!--board -->
      <MsBoard
        ref="msBoard"
        :level="selectedLevel"
        :size="selectedSize"
        @gameOver="stopTimer(), (game = 'is-over')"
        @gameWin="stopTimer(), (game = 'is-win')"
        @firstTouch="startTimer"
        @updateCounter="updateCounter"
      />
      <transition name="fade">
        <MsMessage
          v-if="game === 'is-over' || game === 'is-win'"
          :time="$refs.msTimer.time"
          :bestTime="localStorage.getRecordTime(timeKey)"
          :win="game === 'is-win'"
          @restart="resetBoard(), resetTimer()"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import MsBoard from "./components/MsBoard.vue";
import Timer from "./components/Timer.vue";
import Controls from "./components/MsControlsButton.vue";
import MsMessage from "./components/MsEndMessage.vue";
import LocalStorage from "./classes/LocalStorage.js";
import fullScreenButton from "./components/FullScreenButton.vue";
import { ref } from "vue";

var offset = {
  h: 106,
  w: 22,
};
export default {
  components: { MsBoard, Timer, Controls, MsMessage, fullScreenButton },

  setup() {
    const msTimer = ref();
    const msBoard = ref();
    const localStorage = new LocalStorage();

    return {
      msBoard,
      msTimer,
      offset,
      localStorage,
    };
  },

  data() {
    return {
      selectedLevel: 0.125,
      selectedSize: "s",
      minesLeft: Math.floor(9 * 9 * 0.125),
      sizes: [
        { text: "small", value: 's'},
        { text: "medium", value: "m"},
        { text: "large", value: "l"},
        {text: "screen",value: "sc"},
      ],
      levels: [
        { text: "easy", value: 0.125 },
        { text: "hard", value: 0.1875 },
      ],
      game: "is-ready",
      touchScreen: true,
    };
  },
  created() {},
  mounted() {
    
  },
  computed: {
    timeKey() {
      return (
        this.selectedSize +
        "-" +
        this.selectedLevel
      );
    },
  },
  methods: {
    saveTime() {
      this.localStorage.recordTime(this.timeKey, this.$refs.msTimer.time);
    },
    startTimer() {
      this.$refs.msTimer.start();
      this.game = "is-on";
    },
    stopTimer() {
      this.$refs.msTimer.stop();
    },
    resetTimer() {
      if (this.game == "is-win") this.saveTime();
      this.$refs.msTimer.reset();
      this.game = "is-ready";
    },
    resetBoard() {
      // this.reset = -1*this.reset
      this.$refs.msBoard.restart();
    },
    updateCounter(val) {
      this.minesLeft = val;
    },
  },
};
</script>

<style>
:root {
  --ig-green: #7ac943;
  --ms-red: #ed1d1c;
  --ms-light-blue: #bdebff;
  --ms-light-black: #393939;
  --ms-dark-blue: #404b58;
  --ms-cell--closed: #cfdfe6;
  --ms-cell--open: #fafdff;
  --ms-cell--hover: #e1f0f6;
  --cell-border--open: #82a7bd;
  --cell-border--closed: #f3fbff;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-width: 320px;
}
.ms-restart-button {
  outline: none;
  border: none;
  padding: 0px;
  width: 40px;
  height: 40px;
  margin: 8px;
  display: block;
  background: url(../src/img/ship33.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 25px;
  border-radius: 50%;
  background-color: var(--ms-light-blue);
  border: 3px inset var(--cell-border--closed);
}
@media (hover) {
  .ms-restart-button:hover {
    box-shadow: 0 0 5px 0 #ffffff50 inset, 0 0 10px 0px #ffffff50;
  }
}
.ms-restart-button:active {
  background-size: 28px;
}

.ms-game[state="is-over"] .ms-restart-button {
  background-color: #a3a8ab;
}
.ms-flex--around {
  display: flex;
  justify-content: space-around;
}
.ms-settings label {
  color: white;
  text-align: center;
  font-size: 16px;
  margin: 4px;
}
.ms-settings select {
  color: var(--ms-light-black);
  border: none;
  font-size: 16px;
  margin: 4px;
}
.ms-game {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.ms-game__border-block {
  display: inline-block;
  padding: 4px;
  max-width: 100%;
  position: relative;
  background-color: var(--ms-dark-blue);
  border: 4px ridge var(--ms-dark-blue);
}
.ms-display-window {
  width: 85px;
  align-self: center;
  text-align: center;
  padding: 0.125em;
  font-family: monospace;
  font-size: 24px;
  margin: 8px;
  color: var(--ig-green);
  background-color: var(--ms-light-black);
  border-style: inset;
  border-width: medium;
  border-color: #4a5665;
}
.ms-display,
.ms-flex--around {
  display: flex;
  justify-content: space-around;
}

.ms-display span {
  flex-grow: 0.25;
  flex-shrink: 0;
  flex-basis: 85px;
}
.ms-display button {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 40px;
}
.ms-settings {
  display: grid;
  grid-template-columns: repeat(2, auto) 1fr;
  grid-column-gap: 4px;
  justify-items: right;
}
#config-menu {
  display: none;
  position: absolute;
  margin-top: 86px;
  background: #000000b3;
  width: calc(100% - 8px);
  height: calc(100% - 94px);
  z-index: 2;
}
#config-menu.active {
  display: block;
}
#config-menu ul {
  color: var(--cell-border--closed);
  text-align: left;
  padding-left: 16px;
  list-style: none;
}
#config-menu h2 {
  font-size: 16px;
  color: var(--cell-border--closed);
  margin: 16px;
}
#config-menu ul li:before {
  display: inline-block;
  content: "\2638";
  color: var(--ig-green);
  margin-right: 5px;
}
.ms-board__inner {
  max-width: 300px;
  margin: 0 auto;
}

.fade-enter-active {
  transition: opacity 0.5s ease-in;
  transition-delay: 0.5s;
}
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>