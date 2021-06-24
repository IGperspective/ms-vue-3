<template>
  <button type="button" class="snowman" :active="isActive" @click="toggle">
    <div></div>
    <div></div>
    <div></div>
  </button>
</template>

<script>
export default {
  props: {
    target: String,
  },
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    targetElem() {
      return document.getElementById(this.target);
    },
  },
  methods: {
    toggle(e) {
      this.isActive = !this.isActive;
      if (this.isActive) {
        this.targetElem.classList.add("active");
        //prevent immediate close
        e.stopImmediatePropagation();
        document.body.addEventListener("click", this.close);
      } else {
        this.targetElem.classList.remove("active");
        document.body.removeEventListener("click", this.close);
      }
    },
    close(e) {
      if (
        e.path.some((element) => {
          return element.class == "MS-CONFIG" || element.id == this.target;
        })
      ) {
        return;
      } else {
        this.toggle(e);
      }
    },
  },
};
</script>

<style>
.snowman {
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 1.5rem;
  padding: 5px;
}
.snowman div {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--ig-green);
  transition: all 0.5s ease;
}
.snowman div:not(:last-child) {
  margin-bottom: 0.25rem;
}
.snowman[active="true"] div {
  width: 1.75rem;
  height: 0.25rem;
  transition: all 0.5s ease;
}
.snowman[active="true"] div:nth-child(1) {
  transform: translate(0, 0.5rem) rotate(45deg);
}
.snowman[active="true"] div:nth-child(2) {
  opacity: 0;
}
.snowman[active="true"] div:nth-child(3) {
  transform: translate(0, -0.5rem) rotate(-45deg);
}
</style>