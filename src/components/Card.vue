<template>
  <div :class="['card', sizeClass]">
    <div class="card-header">
      <slot class="header" name="header">默认标题</slot>
    </div>
    <div class="card-body">
      <!-- <div class="body-border left-border"></div>
      <div class="body-border right-border"></div>
      <div class="body-border bottom-border"></div> -->

      <div class="body-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  size?: 'normal' | 'long'
}>()

const sizeClass = computed(() => {
  return props.size === 'long' ? 'card-long' : 'card-normal'
})
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  // backdrop-filter: blur(1px);

  .card-header {
    height: 40px;
    // background-image: url('@/assets/images/box/box-header-2.png');
    background-image: url('@/assets/images/box/card-top-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: left center;
    // background-image: url('@/assets/images/box/box-header_left.png'), url('@/assets/images/box/box-header_right.png');
    // background-repeat: no-repeat, no-repeat;
    // background-position: left center, right center;
    // background-size: contain, contain;
    flex-shrink: 0;
    z-index: 1;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    padding-left: 2.2em;
    color: #fff;

    // .header {
    //   transform: translateY(6px) !important;
    // }
  }

  .card-body {
    position: relative;
    flex: 1;
    background-color: rgb(31 69 103 / 69%); // rgba(#00327D, 0.3);
    overflow: hidden;
    margin: 6px 0 0 0;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 2px solid #18d9fe;

    .body-border {
      position: absolute;
      z-index: 1;
      pointer-events: none;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .left-border {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      background-position: left;
    }

    .right-border {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 10px;
      background-position: right;
    }

    .bottom-border {
      left: 0;
      right: 0;
      bottom: 0;
      height: 20px;
      background-image: url('@/assets/images/box/box-line_bottom.png');
      background-position: bottom;
    }

    .body-content {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
    }
  }

  &.card-normal {
    .left-border {
      background-image: url('@/assets/images/box/box-line_left.png');
      background-repeat: repeat-y;
    }

    .right-border {
      background-image: url('@/assets/images/box/box-line_right.png');
      background-repeat: repeat-y;
    }
  }

  &.card-long {
    .left-border {
      background-image: url('@/assets/images/box/box-line_left_long.png');
      background-repeat: repeat-y;
    }

    .right-border {
      background-image: url('@/assets/images/box/box-line_right_long.png');
      background-repeat: repeat-y;
    }
  }
}
</style>