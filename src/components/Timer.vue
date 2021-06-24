<template>
  <span id="ms-timer" class="ms-display-window">
    {{ timeFormated }}
  </span>
</template>

<script>
export default {
  props: {
    triger: Number,
  },
  data() {
    return {
      time: 0,
      isOn: null,
    };
  },

  computed: {
    timeFormated() {
      let t = this.time;
      return t < 6000
        ? Math.floor(t / 60 / 10) +
            "" +
            Math.floor((t / 60) % 10) +
            ":" +
            Math.floor((t % 60) / 10) +
            "" +
            ((t % 60) % 10)
        : "99:99";
    },
  },

  methods: {
    start() {
      var startDate = new Date();
      this.isOn = setInterval(() => {
        this.time = Math.floor((new Date() - startDate) / 1000);
      }, 1000);
    },
    stop() {
      clearInterval(this.isOn);
      this.isOn = false;
    },
    reset() {
      this.stop();
      this.time = 0;
    },
  },
};
</script>

<style>
</style>