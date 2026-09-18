<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="dialog-mask" @click.self="onClose">
        <transition name="slide-up">
          <div class="dialog-content" v-show="visible">
            <!-- Header -->
            <header class="dialog-header">
              <div class="dialog-title">{{ title }}</div>
              <button class="dialog-close" @click="onClose">✕</button>
            </header>

            <!-- Body -->
            <section class="dialog-body">
              <slot />
            </section>

            <!-- Footer -->
            <footer class="dialog-footer">
              <button v-if="showCancel" class="dialog-btn" @click="onCancel">取消</button>
              <button v-if="showConfirm" class="dialog-btn confirm" @click="onConfirm">确定</button>
            </footer>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: '提示'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'cancel', 'confirm'])

const onClose = () => {
  emit('update:visible', false)
}
const onCancel = () => {
  emit('cancel')
  onClose()
}
const onConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
$header-height: 10vh;
$footer-height: 8vh;

.dialog-mask {
  position: fixed;
  z-index: 999;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  width: 60vw;
  height: 70vh;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2vw;
  font-size: 1.2rem;
  font-weight: bold;
  background: #f0f0f0;
  border-bottom: 1px solid #ddd;
}

.dialog-title {
  flex: 1;
}

.dialog-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.dialog-body {
  flex: 1;
  overflow: auto;
  padding: 1.5vh 2vw;
  background: #fff;
}

.dialog-footer {
  height: $footer-height;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2vw;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  gap: 1vw;
}

.dialog-btn {
  padding: 0.5em 1.5em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #ccc;

  &.confirm {
    background: #007bff;
    color: white;
  }
}

/* Fade in/out mask */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide dialog up/down */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
