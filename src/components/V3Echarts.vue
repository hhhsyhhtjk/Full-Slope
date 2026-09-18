<template>
  <div
    class="container"
    :id="container"
    ref="chartRef"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script setup>
import {
  markRaw,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  defineProps,
} from "vue";
import * as charts from "echarts";
const props = defineProps({
  options: {
    type: Object,
    require: true,
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  top: {
    type: Number,
    default: 0,
  },
  isFirst: {
    type: Boolean,
    default: false,
  },
  container: {
    type: String,
    default: "container",
  },
});
const chartRef = ref();
const Aecharts = reactive({ value: "" });

onMounted(() => {
  // setInterval(() => {
  //   let op = reactive({ value: document.getElementById(props.container) });
  //   if (op.value) {
  //     Aecharts.value = markRaw(charts.init(op.value));
  //   }
  //   Aecharts.value.setOption(props.options);
  //   console.log("changes");
  //   console.log(props.options);
  // }, 5000);
});

const changeEcharts = (options) => {
  if (!Aecharts.value) return;
  Aecharts.value.setOption(options);
  if (props.isFirst) {
    let index = 0;
    Aecharts.value.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: 0,
    });
    Aecharts.value.on("mouseover", (e) => {
      if (e.dataIndex !== index) {
        Aecharts.value.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: index,
        });
      } else {
        Aecharts.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      }
    });
    Aecharts.value.on("mouseout", (e) => {
      index = e.dataIndex;
      Aecharts.value.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: e.dataIndex,
      });
    });
  }
};

watch(
  () => props.options,
  (newval) => {
    if (newval) {
      // debugger
      changeEcharts(newval);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => chartRef.value,
  (val) => {
    if (val) {
      if (chartRef.value) {
        Aecharts.value = markRaw(charts.init(chartRef.value));
        changeEcharts(props.options);
      }
    }
  },
  { immediate: true }
);

const Resize = () => {
  Aecharts.value.resize();
};
onMounted(() => {
  window.addEventListener("resize", Resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", Resize);
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 200px;
}
</style>
