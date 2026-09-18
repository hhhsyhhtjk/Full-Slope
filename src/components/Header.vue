<template>
  <div class="header">
    <date-time class="date"></date-time>
    <img class="bg" src="../assets/images/bg/bg-header2.png" alt="" />
    <h2 class="title">阳光李子后山边坡智慧监测平台</h2>
    <div class="btn-group">
      <button
        class="btn-item btn-setting"
        ref="settingRef"
        @click.stop="togglePanel"
      ></button>
      <button
        class="btn-item btn-fullscreen"
        @click="toggleFullscreen"
      ></button>
    </div>

    <transition name="slide-fade">
      <div v-show="isOpen" ref="panelRef" class="floating-panel">
        <ul class="rainfall-list">
          <li
            class="rainfall-item"
            :class="active === index ? 'active' : ''"
            v-for="(item, index) in rainfall"
            :key="index"
            @click="onRainfallChange(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAppStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import DateTime from "@/components/header/datetime.vue";
import { emitter } from "@/utils/eventBus";

const { isInit } = storeToRefs(useAppStore());

const isOpen = ref(false);
const panelRef = ref<HTMLElement | null>(null);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

const active = ref(0);
const originRainfall = ref(0);
const curRainfall = ref(0);
const rainfall = ref([
  {
    id: 0,
    label: "默认",
    value: -1,
  },
  {
    id: 1,
    label: "关闭",
    value: 0,
  },
  {
    id: 2,
    label: "小雨",
    value: 5,
  },
  {
    id: 3,
    label: "中雨",
    value: 15,
  },
  {
    id: 4,
    label: "大雨",
    value: 30,
  },
]);

const autoSwitch = computed(() => active.value === 0);

const onRainfallChange = (item: any) => {
  active.value = item.id;

  if (item.value !== -1) {
    curRainfall.value = item.value;
    emitter.emit("rainingfallChange", curRainfall.value);
  } else {
    curRainfall.value = originRainfall.value;
    emitter.emit("rainingfallChange", curRainfall.value);
  }
};

emitter.on("setSensorList", (data: any) => {
  console.log(autoSwitch.value);
  if (autoSwitch.value) {
    if (data && data.length > 0) {
      data.forEach((item: any) => {
        if (item?.sensorchildtype?.includes?.("雨量计") ?? false) {
          originRainfall.value = Number(item.lastceliang);
          curRainfall.value = Number(item.lastceliang);

          if (isInit.value) {
            emitter.emit("rainingfallChange", originRainfall.value);
          } else {
            setTimeout(() => {
              emitter.emit("rainingfallChange", originRainfall.value);
            }, 4000);
          }
        }
      });
    }
  }
});

const isFullscreen = ref(false);

const checkFullscreen = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
};

const toggleFullscreen = () => {
  const el = document.documentElement;
  if (!isFullscreen.value) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};

const onFullscreenChange = () => {
  checkFullscreen();
};

onMounted(() => {
  checkFullscreen();
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  document.addEventListener("mozfullscreenchange", onFullscreenChange);
  document.addEventListener("MSFullscreenChange", onFullscreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
  document.removeEventListener("mozfullscreenchange", onFullscreenChange);
  document.removeEventListener("MSFullscreenChange", onFullscreenChange);
});
</script>

<style lang="scss" scoped>
#my-card {
  #my-list {
    width: 20vw;
    height: 20vw;
    padding: 0;
    background-color: transparent !important;
    box-shadow: none !important;
    border-radius: 0.5vw;
  }
}

.header {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 8vh;
  z-index: 12;
  $base-bg-color: rgb(38, 75, 112);
  background: linear-gradient(
    to bottom,
    rgba($base-bg-color, 1) 0%,
    rgba($base-bg-color, 0.8) 20%,
    rgba($base-bg-color, 0.4) 40%,
    rgba($base-bg-color, 0.2) 60%,
    rgba($base-bg-color, 0.1) 80%,
    rgba($base-bg-color, 0) 100%
  );
  // background-image: url("@/assets/images/bg/bg-header3.png");
  // background-size: 100% 100%;
  box-sizing: border-box;

  .bg {
    position: absolute;
    width: 100%;
  }

  .title {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 0.5vw;
    font-size: 1.8vw;
    font-family: "YouSheBiaoTiHei" !important;
    letter-spacing: 0.15em;
    color: #fff;
    font-weight: bold;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .date {
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 1.1vw;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
    font-size: 1.1vw;
    z-index: 9;
  }

  .btn-group {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1vw;
    padding-right: 1vw;
    z-index: 9;

    .v-list {
      background-color: transparent !important;
      box-shadow: none !important;
    }

    .btn-item {
      width: 4vh;
      height: 4vh;
      aspect-ratio: 1 / 1;
      padding: 0;
      overflow: hidden;
      background-color: rgba(0, 88, 177, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;
      border: none;
      background-size: 60% 60%;
      background-position: center;
      background-repeat: no-repeat;

      &.btn-setting {
        background-image: url("@/assets/images/card/icon-setting.png");
      }

      &.btn-fullscreen {
        background-image: url("@/assets/images/card/icon-fullscreen.png");
      }

      // &:hover {
      //   transform: scale(1.1);
      // }
    }
  }

  .floating-panel {
    position: absolute;
    top: 2vh;
    right: 14vh;
    // width: 200px;
    // padding: 1rem;
    // border-radius: 10px;
    // border: 1px solid rgba(0, 65, 129, 0.5);
    // background-color: rgba(1, 84, 168, 0.3);
    // box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    z-index: 10;

    .rainfall-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-flow: row nowrap;
      gap: 0.5rem;

      .rainfall-item {
        width: 6vh;
        height: 4vh;
        line-height: 4vh;
        text-align: center;
        border: #4b53b9 1px solid;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: rgba(0, 65, 129, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        color: #fff;
        font-size: 14px;

        &.active,
        &:hover {
          background-color: rgba(0, 65, 129, 0.8);
        }
      }
    }
  }
}

// 悬浮面板动画（从左向右淡入淡出）
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
