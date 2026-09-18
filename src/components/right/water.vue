<template>
  <ul class="water-list">
    <li class="water-item">
      <div class="icon-container">
        <img
          class="rain-icon"
          src="@/assets/images/card/rian.png"
          alt="雨量图标"
        />
      </div>
      <div class="info-container">
        <div class="title">今日降雨量</div>
        <div class="value">
          <span class="number">{{ waterData.rain }}</span>
          <span class="unit">mm</span>
        </div>
      </div>
      <div class="info-container">
        <div class="title">累计降雨量</div>
        <div class="value">
          <span class="number">{{ 1.35 * 1.2 }}</span>
          <span class="unit">mm</span>
        </div>
      </div>
    </li>
    <V3Echarts height="10vh" :options="options1" width="19vw" />
  </ul>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from "vue";
import { emitter } from "@/utils/eventBus";
import V3Echarts from "@/components/V3Echarts.vue";

import * as echarts from "echarts";
const options1 = {
  tooltip: { show: true },
  grid: {
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      axisLine: {
        //坐标轴轴线相关设置。数学上的x轴
        show: false,
        lineStyle: {
          color: "#233e64",
        },
      },
      axisLabel: {
        show: false,
      },
      axisTick: { show: false },
      data: ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7"],
    },
  ],
  yAxis: [
    {
      type: "value",
      min: 0,
      max: 140,
      splitNumber: 7,
      splitLine: {
        show: false,
        lineStyle: {
          color: "#233e64",
        },
      },
      axisLine: { show: false },
      axisLabel: {
        show: false,
      },
      axisTick: { show: false },
    },
  ],
  series: [
    {
      name: "异常流量",
      type: "line",
      smooth: true, //是否平滑曲线显示
      // 			symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
      symbolSize: 0,

      lineStyle: {
        normal: {
          color: "#3deaff", // 线条颜色
        },
      },
      areaStyle: {
        //区域填充样式
        normal: {
          //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              { offset: 0, color: "rgba(61,234,255, 0.9)" },
              { offset: 0.7, color: "rgba(61,234,255, 0)" },
            ],
            false
          ),

          shadowColor: "rgba(53,142,215, 0.9)", //阴影颜色
          shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        },
      },
      data: [90, 105, 84, 125, 110, 92, 98],
    },
  ],
};

const waterData = reactive({
  water: 0,
  waterUnit: "",
  rain: 0,
  rainUnit: "",
});

emitter.on("setSensorList", (data: any) => {
  if (data && data.length > 0) {
    data.forEach((item: any) => {
      if (item.sensorchildtype && item.sensorchildtype.includes("雨量计")) {
        waterData.rain = item.lastceliang;
        waterData.rainUnit = item.unit;
      } else if (
        item.sensorchildtype &&
        item.sensorchildtype.includes("水位计")
      ) {
        waterData.water = item.lastceliang;
        waterData.waterUnit = item.unit;
      }
    });
  }
});

onMounted(() => {});
onUnmounted(() => {});
</script>

<style lang="scss" scoped>
.water-list {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

.water-item {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 35px;
  padding: 10px;
  box-sizing: border-box;

  .icon-container {
    flex: 0 0 auto;
    width: 4vw;
    height: 4vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .rain-icon {
      width: 100%;
      height: 100%;
      object-fit: contain;
      animation: float 3s ease-in-out infinite;
    }
  }

  .info-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 0.8vw;
      color: #fff;
      margin-bottom: 5px;
      font-family: "PangMenZhengDao";
    }

    .value {
      display: flex;
      align-items: baseline;
      gap: 1vw;

      .number {
        font-size: 1.2vw;
        font-weight: bold;
        background: #09c8d9;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: "YouSheBiaoTiHei";
      }

      .unit {
        font-size: 0.8vw;
        color: #fff;
      }
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}
</style>
