<template>
  <div class="warn-wrap" ref="warnListEl">
    <app-loading
      v-show="loadingWarn"
      class="loading"
      :loading="loadingWarn"
    ></app-loading>
    <div v-show="!loadingWarn && warnList.length === 0" class="empty">
      暂无数据
    </div>
    <ul
      v-show="!loadingWarn && warnList.length > 0"
      class="warn-list"
      :class="{ scrolling: shouldScroll }"
      :style="shouldScroll ? { animationDuration } : {}"
    >
      <template v-for="n in shouldScroll ? 2 : 1">
        <li
          class="warn-item"
          v-for="(item, index) in warnList"
          :key="`${n}-${index}`"
        >
          <div class="name" :title="item.sensorselfno">
            {{ item.sensorselfno }}
          </div>
          <div class="desc" :title="item.desc">{{ item.desc }}</div>
          <div class="date" :title="item.createtime">
            {{ item.createtime.split(" ")[1] }}
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from "vue";
import { QueryWarnData } from "@/api/bigscreen";
import appLoading from "../Loading.vue";

const loadingWarn = ref<boolean>(false);
const warnList = ref<any[]>([]);
const warnListEl = ref<HTMLElement | null>(null);
const limit = ref<any>(8);
const ITEM_HEIGHT = 40;
const GAP = 10;

const animationDuration = ref("30s");

const updateScrollSpeed = () => {
  if (!warnListEl.value) return;
  const itemCount = warnList.value.length;
  const contentHeight = itemCount * (ITEM_HEIGHT + GAP);
  const speedPerPixel = 0.03;
  const duration = contentHeight * speedPerPixel;
  animationDuration.value = `${duration}s`;
};

const updateLimit = () => {
  if (!warnListEl.value) return;
  const height = warnListEl.value.clientHeight;
  limit.value = Math.floor((height + GAP) / (ITEM_HEIGHT + GAP));
};

let resizeObserver: ResizeObserver | null = null;

const shouldScroll = computed(() => warnList.value.length > limit.value);

const formatDate = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWarnData = async () => {
  loadingWarn.value = true;
  warnList.value = [];
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);
  const params = {
    start: todayStr,
    end: tomorrowStr,
    page: "1",
    limit: "99999",
  };
  try {
    const res = await QueryWarnData(params);

    if (res.status === 200) {
      warnList.value = res.data.result.data;

      nextTick(() => {
        updateLimit();
        updateScrollSpeed();
      });
    }
  } catch (error) {
    console.error("get warn data error", error);
  } finally {
    loadingWarn.value = false;
  }
};

let sensorDataInterval: number | null = null;

onMounted(() => {
  getWarnData();

  sensorDataInterval = window.setInterval(() => {
    getWarnData();
  }, 60000);

  nextTick(() => {
    updateLimit();

    if (warnListEl.value) {
      resizeObserver = new ResizeObserver(() => {
        updateLimit();
      });
      resizeObserver.observe(warnListEl.value);
    }
  });
});

onBeforeUnmount(() => {
  if (resizeObserver && warnListEl.value) {
    resizeObserver.unobserve(warnListEl.value);
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  if (sensorDataInterval !== null) {
    clearInterval(sensorDataInterval);
    sensorDataInterval = null;
  }
});
</script>

<style lang="scss" scoped>
.warn-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  @keyframes scroll-up {
    0% {
      transform: translateY(0%);
    }

    100% {
      transform: translateY(-50%);
    }
  }

  .warn-list.scrolling {
    // animation: scroll-up 20s linear infinite;
    animation-name: scroll-up;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .warn-list {
    padding: 0;
    margin: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    gap: 10px;

    .warn-item {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #00497438;
      border-radius: 5px;
      background: linear-gradient(
        to top,
        rgba(0, 7, 71, 0.7),
        rgba(57, 182, 255, 0.3)
      );
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px;
      box-sizing: border-box;
      color: #fff;
      font-size: 0.8em;
      font-weight: bold;
      gap: 10px;

      .name,
      .desc,
      .date {
        font-weight: 400;
      }

      .name {
        flex-shrink: 0;
        font-size: 14px;
        display: flex;
        align-items: center;
      }

      .desc {
        flex: 1 1 auto;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: wrap;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
      }

      .date {
        flex-shrink: 0;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
