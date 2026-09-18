<template>
  <div v-if="loading" :class="['loading-overlay', { 'full-screen': fullScreen }, { 'mask': mask }]">
    <div class="spinner"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: Boolean,
    default: false,
  }
});
</script>

<style lang="scss" scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.mask {
  background: rgba(0, 0, 0, 0.5);
}

.full-screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
