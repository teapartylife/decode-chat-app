<template>
  <div ref="blocky" />
</template>

<script>
import { createIcon } from '@download/blockies';

export default {
  props: {
    address: {
      type: String,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 10,
    },
    scale: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    address() {
      this.renderBlocky();
    },
  },
  mounted() {
    this.renderBlocky();
  },
  methods: {
    renderBlocky() {
      let scale = this.small ? 1.5 : 2.2;
      if (this.scale) scale = this.scale;

      const icon = createIcon({
        bgcolor: this.bgColor,
        color: this.color,
        seed: this.address, // seed used to generate icon data, default: random
        size: this.size, // width/height of the icon in blocks, default: 10
        scale, // width/height of each block in pixels, default: 5
      });

      this.$refs.blocky.innerHTML = '';
      this.$refs.blocky.appendChild(icon);
    },
  },
};
</script>
