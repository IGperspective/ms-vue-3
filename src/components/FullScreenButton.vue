<script>
import { h } from "vue";
import FullScreen from "../classes/fullScreenMode.js";

export default {
  props: {
    target: {
      type: String,
      default: "ig-game",
    },
  },
  data() {
    return {
      touchScreen:
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0,
    };
  },
  render() {
    if (this.touchScreen) return h("f-button", { elem: "ig-game" });
  },
  mounted() {
    if (this.touchScreen) customElements.define("f-button", FullScreen);
  },
};
</script>