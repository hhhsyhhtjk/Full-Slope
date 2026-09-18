<template>
  <transition :name="transitionName" appear>
    <div class="main aside">
      <app-card class="card card-info" size="normal">
        <template #header>
          <span class="title">楼栋监测</span>
        </template>
        <div class="yuqing-box">
          <div class="yuqing-left">
            <div class="value">80</div>
            <div>风险等级</div>
          </div>
          <div class="yuqing-right">
            <div class="yuqing-right-item">
              <div class="text">影响楼栋</div>
              <div class="value">5</div>
            </div>
            <div class="yuqing-right-item">
              <div class="text">影响房屋</div>
              <div class="value">152</div>
            </div>
            <div class="yuqing-right-item">
              <div class="text">影响人口</div>
              <div class="value">1356</div>
            </div>
          </div>
        </div>

        <div class="dev-box">
          <V3Echarts :options="options1" width="18vw" height="19vh" />
        </div>
      </app-card>

      <!-- ---------------------预警------------------ -->
      <app-card class="card card-warn" size="normal">
        <template #header>
          <span class="title">当日预警</span>
        </template>
        <div class="body warn" ref="warnListEl">
          <warn-card></warn-card>
        </div>
      </app-card>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import appCard from "./Card.vue";
// import InfoCard from '@/components/left/info.vue';
import WarnCard from "@/components/left/warn.vue";
// import { emitter } from '@/utils/eventBus';

import V3Echarts from "@/components/V3Echarts.vue";

import * as echarts from "echarts";
const options1 = getOption();

function getOption() {
  return {
    grid: {
      top: "25%",
      bottom: "10%", //也可设置left和right设置距离来控制图表的大小
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
        },
      },
    },

    xAxis: {
      data: [
        "当年完成水量",
        "去年同期水量",
        "滚动目标值水量",
        "全年目标值水量",
        "当年完成金额",
        "去年同期金额",
        "滚动目标金额",
        "全年目标值",
      ],
      axisLine: {
        show: false, //隐藏X轴轴线
        lineStyle: {
          color: "#01FCE3",
        },
      },
      axisTick: {
        show: false, //隐藏X轴刻度
      },
      axisLabel: {
        show: false,
        textStyle: {
          color: "#ebf8ac", //X轴文字颜色
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "亿元",
        nameTextStyle: {
          color: "#FFFFFF",
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: true,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#FFFFFF",
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#FFFFFF",
          },
        },
      },
      {
        type: "value",
        name: "同比",
        nameTextStyle: {
          color: "#FFFFFF",
        },
        position: "right",
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          formatter: "{value} %", //右侧Y轴文字显示
          textStyle: {
            color: "#FFFFFF",
          },
        },
      },
      {
        type: "value",
        gridIndex: 0,
        min: 50,
        max: 100,
        splitNumber: 8,
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["rgba(250,250,250,0.0)", "rgba(250,250,250,0.05)"],
          },
        },
      },
    ],
    series: [
      {
        name: "销售水量",
        type: "line",
        yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
        smooth: true, //平滑曲线显示
        showAllSymbol: true, //显示所有图形。
        symbol: "circle", //标记的图形为实心圆
        symbolSize: 10, //标记的大小
        itemStyle: {
          //折线拐点标志的样式
          color: "#058cff",
        },
        lineStyle: {
          color: "#058cff",
        },
        areaStyle: {
          color: "rgba(5,140,255, 0.2)",
        },
        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      },
      {
        name: "主营业务",
        type: "bar",
        barWidth: 15,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#00FFE3",
              },
              {
                offset: 1,
                color: "#4693EC",
              },
            ]),
          },
        },
        data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5],
      },
    ],
  };
}

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

onBeforeUnmount(() => {});
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
    height: 50%;

    .title {
      font-weight: bold;
      font-size: 24px;
      font-family: "YouSheBiaoTiHei" !important;
    }

    .body {
      width: 100%;
      height: 100%;

      .grid-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 10px;

        .grid-item {
          padding: 20px;
          text-align: center;
          border-radius: 5px;
        }
      }

      &.info {
        color: #ffffff;

        p {
          font-size: 0.8vw;
          text-indent: 1.6vw;
        }
      }

      &.warn {
      }
    }
  }
}

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

.yuqing-box {
  display: flex;
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 12px 0px;
}

// .yuqing-box::before,
// .yuqing-box::after {
//   content: "";
//   position: absolute;
//   left: 0;
//   right: 0;
//   height: 3px;
//   background: linear-gradient(
//     90deg,
//     rgba(0, 255, 255, 0) 0%,
//     rgba(0, 255, 255, 0.8) 50%,
//     rgba(0, 255, 255, 0) 100%
//   );
// }

.yuqing-box::before {
  top: 0;
}

.yuqing-box::after {
  bottom: 0;
}

.yuqing-left {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-image: url("@/assets/images/dam/bg1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  .value {
    font-family: Ding !important;
    font-size: 50px;
    font-weight: bold;
    background: linear-gradient(180deg, #ffffff 0%, #7ad8ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
    margin-top: -40px;
  }
}

.yuqing-left div:last-child {
  font-size: 14px;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.8);
}

.yuqing-right {
  flex: 1;
  padding: 0 15px;
}

.yuqing-right-item {
  flex: 1;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 4px;
  background-image: url("@/assets/images/dam/bg2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.yuqing-right-item {
  padding-left: 25px;
  .text {
    flex: 1;
    font-size: 14px;
    color: #fff;
    margin-top: -6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .value {
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    min-width: 40px;
    text-align: right;
    text-shadow: 0 0 8px rgba(0, 195, 255, 0.5);
    font-family: "DS-DIGIT";
    margin-top: -6px;
  }
}
.dev-box {
  display: flex;
  justify-content: space-between;
}
</style>
