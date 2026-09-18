<template>
  <transition :name="transitionName" appear>
    <div class="main aside">
      <app-card class="card card-water" size="normal">
        <template #header>
          <span class="title">实时雨量</span>
        </template>
        <div class="body">
          <water-card></water-card>
        </div>
      </app-card>
      <app-card class="card card-chart" size="normal">
        <template #header>
          <span class="title">视频直播</span>
        </template>
        <div class="body">
          <chart-card></chart-card>
        </div>
      </app-card>
      <app-card class="card card-device" size="normal">
        <template #header>
          <span class="title">设备列表</span>
        </template>
        <div class="body">
          <device-card></device-card>
          <!-- <ring-bg /> -->
        </div>
      </app-card>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import appCard from "./Card.vue";
import DeviceCard from "@/components/right/device.vue";
import ChartCard from "@/components/right/chart.vue";
import WaterCard from "@/components/right/water.vue";
// import RingBg from '@/components/right/ring.vue';
import IMAGES from "@/utils/images.json";

const markers = ref<any[]>([]);

const mergeAllMarkers = (data: any) => {
  const allMarkers: any = [];

  if (Array.isArray(data.scenes)) {
    data.scenes.forEach((scene: any) => {
      if (Array.isArray(scene.markers)) {
        allMarkers.push(...scene.markers);
      }
    });
  }
  return allMarkers;
};

markers.value = mergeAllMarkers(IMAGES);

const props = defineProps<{
  direction?: "ltr" | "rtl" | "ttb" | "btt";
}>();

const transitionName = computed(() => {
  switch (props.direction) {
    case "rtl":
      return "slide-rtl";
    case "ttb":
      return "slide-ttb";
    case "btt":
      return "slide-btt";
    case "ltr":
    default:
      return "slide-ltr";
  }
});

onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.main {
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;
  gap: 1rem;
  box-sizing: border-box;
  font-family: "PangMenZhengDao";

  .card {
    &.card-device {
      height: 35%;
    }

    &.card-chart {
      height: 35%;
    }

    &.card-water {
      height: 30%;
    }

    .title {
      font-weight: bold;
      font-size: 24px;
      font-family: "YouSheBiaoTiHei" !important;
    }

    .body {
      width: 100%;
      height: 100%;
      overflow: hidden auto;

      &::-webkit-scrollbar {
        display: none;
      }

      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  }
}

/* 方向动画样式 */

.slide-ltr-enter-active,
.slide-rtl-enter-active,
.slide-ttb-enter-active,
.slide-btt-enter-active {
  transition: transform 1s ease-in-out;
}

.slide-ltr-enter-from {
  transform: translateX(-100%);
}

.slide-ltr-enter-to {
  transform: translateX(0);
}

.slide-rtl-enter-from {
  transform: translateX(100%);
}

.slide-rtl-enter-to {
  transform: translateX(0);
}

.slide-ttb-enter-from {
  transform: translateY(-100%);
}

.slide-ttb-enter-to {
  transform: translateY(0);
}

.slide-btt-enter-from {
  transform: translateY(100%);
}

.slide-btt-enter-to {
  transform: translateY(0);
}
</style>
