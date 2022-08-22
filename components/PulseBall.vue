<template>
  <div
    :class="`pulse pulse-${color}`"
    :style="`height: ${size}px; width: ${size}px;`"
  />
</template>

<script>
export default {
  name: 'PulseBall',
  props: {
    color: {
      type: String,
      default: 'green', // green, gray
    },
    size: {
      type: [Number, String],
      default: 7.5,
    },
  },
};
</script>

<style lang="scss" scoped>
.pulse {
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  margin: 10px;
  transform: scale(1);

  &.pulse-green {
    background: rgba(122, 250, 135, 1);
    box-shadow: 0 0 0 0 rgba(122, 250, 135, 1);
    animation: pulse-green 1.5s infinite;
  }

  &.pulse-gray {
    background: rgba(222, 222, 220, 1);
    box-shadow: 0 0 0 0 rgba(222, 222, 220, 1);
  }
}

@keyframes pulse-green {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(122, 250, 135, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(122, 250, 135, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(122, 250, 135, 0);
  }
}
</style>
