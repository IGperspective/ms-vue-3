<template>
  <div class="ms-message" onclick="this.setAttribute('style', 'display:none');">
    <div class="ms-message__content">
      <p v-if="win" class="ms-message__text">
        Congrats!
        <br /><br />
        <em v-if="time < bestTime">
          {{ `new record - ${time} sec` }}
        </em>
        <em v-else>
          {{ `your time - ${time} sec` }}
          <br />
          {{ `best time - ${bestTime} sec` }}
        </em>
      </p>
      <p v-else class="ms-message__text">GAME OVER</p>
      <button @click.stop="this.$emit('restart')" class="ms-message__button">
        {{ win ? "play again" : "restart" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    time: Number,
    bestTime: Number,
    win: Boolean,
  },
  emits: {
    restart: null,
  },
};
</script>

<style>
.ms-message {
  opacity: 1;
  position: absolute;
  text-align: center;
  z-index: 1;
  padding-top: 35px;
  left: 4px;
  top: 90px;
  width: calc(100% - 8px);
  height: calc(100% - 92px);
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.ms-message__content {
  background-color: #404b58eb;
  margin: auto;
  padding: 16px;
  border: 1px solid var(--ms-dark-blue);
  width: 100%;
}
.ms-message__text {
  margin: 18px;
  color: var(--cell-border--closed);
}
.ms-message__button {
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: 2px solid var(--cell-border--closed);
  border-radius: 0.6em;
  color: var(--cell-border--closed);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  margin: 16px;
  padding: 8px;
  text-decoration: none;
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
}
.ms-message__button:hover {
  box-shadow: 0 0 10px 0 var(--cell-border--closed) inset,
    0 0 10px 4px var(--cell-border--closed);
}
.ms-message__button:hover,
.ms-message__button:focus {
  outline: 0;
  color: #fff;
}
.ms-message__button:active {
  background-color: white;
  color: black;
}
.message__text em {
  margin: 4px;
  display: block;
}
</style>