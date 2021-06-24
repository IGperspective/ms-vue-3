<template>
  <div
    class="ms-cell"
    :quick="quickReveal && interactive ? true : undefined"
    :class="[
      cellClasses,
      cellColors,
      { 'm-action': mouseAction, 't-action': touchAction },
    ]"
    @click.left="leftClickHandler().then(leftClickAction)"
    @click.right.prevent="toggleMarker"
    @touchstart.stop="touchHandler"
    @mousedown="addMouseEffects($event)"
  >
    {{ number }}
  </div>
</template>


<script setup>
import { defineProps, reactive, computed, defineEmit, watch, ref } from "vue";

const props = defineProps({
  value: Number,
  quickReveal: Boolean,
  interactive: Boolean,
  marker: Object,
  open: {
    type: Boolean,
    default: false,
  },
});
const is = reactive({
  flagged: computed(() => props.marker.flag),
  indoubt: computed(() => props.marker.question),
  marked: computed(() => props.marker.flag || props.marker.question),
  activeClosed: computed(() => !props.open && props.interactive),
  open: computed(() => props.open),
  over: computed(() => !props.interactive),
  quickReveal: computed(() => props.quickReveal),
});
const number = computed(() =>
  props.open ? (props.value > 0 && props.value < 9 ? props.value : null) : null
);
const cellClasses = computed(() => {
  return {
    "-is-open": is.open,
    "-is-closed": !is.open,
    "-is-marked": is.marked && !is.open,
    "-no-marker": !is.marked,
    "-is-marked--wide": is.flagged && !(props.value == 9) && is.over,
    "marker--flag": is.flagged,
    "marker--doubt": is.indoubt && !is.open,
    "-is-mined": props.value == 9 && !is.activeClosed,
    active: (is.quickReveal || !is.open) && !is.over,
  };
});
const cellColors = computed(() => {
  if (number.value) {
    return `c-${number.value}`;
  }
});

const emit = defineEmit({
  open: null,
  quickReveal: null,
  removeMarker: null,
  toggleMarker: null,
});
//watch(ref, (n,o)=>{console.log(n,o)});
//or
watch(
  () => is.flagged,
  (now, prev) => {
    console.log("marker change from " + prev + " to " + now);
  }
);
// onUnmounted(()=>{
//   console.log(props.id, " off")
// });

const mouseAction = ref(false);
const touchAction = ref(false);
const click = ref(null);
const touch = ref(null);

const leftClickHandler = () => {
  return new Promise((resolve, reject) => {
    if (!props.interactive) {
      return;
    }
    if (click.value) {
      clearTimeout(click.value);
      click.value = null;
      resolve("dblClick");
    } else if (props.quickReveal) {
      click.value = setTimeout(() => {
        click.value = null;
        return;
      }, 300);
    } else {
      click.value = null;
      resolve("singlClick");
    }
  });
};
const leftClickAction = (clickType) => {
  if (clickType == "dblClick") {
    emit("quickReveal");
  } else if (clickType == "singlClick") {
    changeState();
  }
};

const addMouseEffects = (e) => {
  const removeClass = () => {
    mouseAction.value = false;
    document.removeEventListener("mouseup", removeClass);
  };
  if (e.button == 0) {
    mouseAction.value = true;
    //emit('highlightQuickRevealAdjacent')
    document.addEventListener("mouseup", removeClass);
  }
};
const touchHandler = (event) => {
  //prevent context menu on mobile
  event.target.addEventListener("touchend", (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
  });
  const shortTap = () => {
    changeState();
  };
  const longTap = () => {
    touch.value = null;
    event.target.removeEventListener("touchend", touchEnd);
    touchAction.value = false;
    toggleMarker();
  };
  const cancelTouch = (e) => {
    //threshold 10px
    if (
      Math.sqrt(
        (event.touches[0].pageY - e.touches[0].pageY) ** 2 +
          (event.touches[0].pageX - e.touches[0].pageX) ** 2
      ) > 10
    ) {
      clearTimeout(touch.value);
      touch.value = null;
      touchAction.value = false;
      event.target.removeEventListener("touchmove", cancelTouch);
      event.target.removeEventListener("touchend", touchEnd);
    }
  };
  const touchEnd = () => {
    if (touch.value) {
      clearTimeout(touch.value);
      touch.value = null;
      shortTap();
      touchAction.value = false;
    }
    event.target.removeEventListener("touchend", touchEnd);
    event.target.removeEventListener("touchmove", cancelTouch);
  };
  const doubleTap = () => {
    if (touch.value) {
      clearTimeout(touch.value);
      touch.value = null;
      emit("quickReveal");
    } else {
      touch.value = setTimeout(() => {
        touch.value = null;
      }, 300);
    }
  };

  // if game over
  if (!props.interactive) {
    return;
  }
  if (props.quickReveal) {
    doubleTap();
    return;
  }
  touchAction.value = true;
  touch.value = setTimeout(longTap, 200);
  event.target.addEventListener("touchmove", cancelTouch);
  event.target.addEventListener("touchend", touchEnd);
};

function changeState() {
  if (!is.activeClosed) {
    return;
  } else if (is.marked) {
    emit("removeMarker");
  } else {
    emit("open");
  }
}

const toggleMarker = () => {
  if (!is.activeClosed) {
    return;
  } else {
    emit("toggleMarker");
  }
};
</script>



<style>
.ms-cell {
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  display: block;
  float: left;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  border-style: solid;
  border-color: var(--cell-border--open);
  border-width: 0;
  border-bottom-width: 1px;
  border-right-width: 1px;
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: calc(100% - 4px);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  user-select: none;
}
.-is-open {
  background-color: var(--ms-cell--open);
  background-size: calc(100% - 9px);
}
.-is-closed {
  border-style: outset;
  border-width: 3px;
  border-color: var(--cell-border--closed);
  background-color: var(--ms-cell--closed);
}
.ms-cell.-is-open:last-child {
  border-right: none;
}

.ms-cells__row:last-child .ms-cell.-is-open {
  border-bottom: none;
}

.marker--flag {
  background-image: url("../img/flag.svg");
}
.marker--flag.-is-marked--wide {
  background-image: url("../img/flag-crossed.svg");
}

.marker--doubt {
  background-image: url("../img/question-mark.svg");
}

.-is-mined {
  background-image: url("../img/mine.svg");
}
.active {
  cursor: pointer;
}
.-is-open.-is-mined.-no-marker {
  background-color: #ed1d1c;
}
.-is-open.-is-mined.marker--flag {
  background-color: white;
  animation-name: revealMine;
  animation-duration: 2s;
}

@media screen and (max-width: 768px) {
  .ms-cell[quick] {
    box-shadow: inset 0px 1px 9px 6px #d4e4ec;
  }
  .marker--flag:after {
    content: "";
    z-index: -1;
    opacity: 0;
    left: -3px;
    top: -3px;
    width: 0;
    height: 0;
    box-sizing: border-box;
    display: block;
    float: left;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    border-style: solid;
    position: absolute;
    border-style: outset;
    border-width: 3px;
    border-color: var(--cell-border--closed);
    background-color: var(--ms-cell--closed);
    background-position: top;
    background-repeat: no-repeat;
    background-size: calc(100% - 4px);
    background-image: url("../img/flag.svg");
  }
  .ms-cells__row:first-child .marker--flag:after {
    animation-name: marker-flag-top;
    animation-duration: 0.3s;
  }
  .marker--flag:after {
    animation-name: marker-flag;
    animation-duration: 0.3s;
  }
  @keyframes marker-flag-top {
    0% {
      width: 32px;
      height: 64px;
      top: -3px;
      background-position: bottom;
      opacity: 1;
      z-index: 1;
    }
    50% {
      width: 32px;
      height: 50px;
      top: -3px;
      background-position: bottom;
      opacity: 1;
      z-index: 1;
    }
    100% {
      width: 32px;
      height: 32px;
      top: -3px;
      background-position: bottom;
      opacity: 1;
      z-index: 1;
    }
  }
  @keyframes marker-flag {
    0% {
      width: 32px;
      height: 64px;
      top: -35px;
      background-position: top;
      opacity: 1;
      z-index: 1;
    }
    50% {
      width: 32px;
      height: 50px;
      top: -21px;
      background-position: top;
      opacity: 1;
      z-index: 1;
    }
    100% {
      width: 32px;
      height: 32px;
      top: -3px;
      background-position: top;
      opacity: 1;
      z-index: 1;
    }
  }
}

.ms-cell.active.-no-marker.t-action {
  background-color: none;
  animation-name: on-reveal;
  animation-duration: 0.2s;
}

@keyframes on-reveal {
  0% {
    border-width: 2px;
    opacity: 40%;
  }

  50% {
    border-width: 1px;
    opacity: 10%;
  }

  100% {
    border-width: 2px;
    opacity: 100%;
  }
}
@keyframes revealMine {
  0% {
    background-color: var(--ms-cell--closed);
  }
  100% {
    background-color: var(--ms-cell--open);
  }
}
.ms-cell.active.-is-marked.t-action {
  animation-name: on-marker;
  animation-duration: 0.3s;
}

@keyframes on-marker {
  0% {
    background-size: 70%;
  }

  50% {
    background-size: 40%;
  }

  100% {
    background-size: 0%;
  }
}

@media (hover) {
  .ms-restart-button:hover {
    box-shadow: 0 0 5px 0 #ffffff50 inset, 0 0 10px 0px #ffffff50;
  }
  .ms-cell[quick]:hover {
    box-shadow: inset 0px 1px 9px 6px #d4e4ec;
  }
  .ms-cell.active.-is-closed:hover {
    background-color: var(--ms-cell--hover);
  }
  .ms-cell.active.-is-closed.-no-marker:after {
    content: " ";
    background-color: white;
    display: block;
    position: absolute;
    padding: 0px;
    margin-top: 13px;
    margin-left: 13px;
    opacity: 20%;
    border-radius: 50%;
    transition: all 0s;
  }

  .ms-cell.active.-is-closed.-no-marker.m-action:hover {
    border-width: 2px;
    background: var(--ms-cell--hover);
  }
  .ms-cell.active.-is-closed.-no-marker.m-action:hover:after {
    margin-top: -1px;
    margin-left: -1px;
    padding: 15px 15px 14px 14px;
    border-radius: 0%;
    opacity: 0.5;
    transition: 0.1s;
  }
}
.c-1 {
  color: #1e90ff;
}

.c-2 {
  color: mediumseagreen;
}

.c-3 {
  color: tomato;
}

.c-4 {
  color: #a843ff;
}

.c-5 {
  color: darkblue;
}

.c-6 {
  color: darkgreen;
}

.c-7 {
  color: maroon;
}

.c-8 {
  color: magenta;
}
</style>