<template>
  <div class="device">
    <div class="wrap">
      <!-- 非分组设备 -->
      <div class="device-list">
        <div
          v-for="(device, index) in otherDevices"
          :key="index"
          class="device-item"
          @click="handleDeviceClick(device)"
        >
          <span>{{ device.sensorselfno }}</span>
        </div>
      </div>
    </div>
    <V3Echarts height="18vh" :options="options1" width="18vw" />
  </div>
</template>

<script lang="ts" setup>
import { emitter } from "@/utils/eventBus";
import ShiPingData from "./sp.json";
import V3Echarts from "@/components/V3Echarts.vue";

import * as echarts from "echarts";
const options1 = getOption();

function getOption() {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "40%",
      right: "3%",
      left: "10%",
      bottom: "12%",
    },
    xAxis: [
      {
        type: "category",
        data: ["球机1层1", "2层球机", "2层枪机", "3层枪机"],
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)",
          },
        },
        axisLabel: {
          margin: 8,
          color: "#e2e9ff",
          textStyle: {
            fontSize: 12,
          },
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}",
          color: "#e2e9ff",
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: [300, 350, 400, 203],
        barWidth: "20px",
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(0,244,255,1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(0,77,167,1)", // 100% 处的颜色
                },
              ],
              false
            ),
            barBorderRadius: [30, 30, 30, 30],
            shadowColor: "rgba(0,160,221,1)",
            shadowBlur: 4,
          },
        },
        label: {
          normal: {
            show: true,
            lineHeight: 30,
            width: 80,
            height: 30,
            backgroundColor: "rgba(0,160,221,0.1)",
            borderRadius: 200,
            position: ["-8", "-60"],
            distance: 1,
            formatter: ["    {d|●}", " {a|{c}}     \n", "    {b|}"].join(","),
            rich: {
              d: {
                color: "#3CDDCF",
              },
              a: {
                color: "#fff",
                align: "center",
              },
              b: {
                width: 1,
                height: 30,
                borderWidth: 1,
                borderColor: "#234e6c",
                align: "left",
              },
            },
          },
        },
      },
    ],
  };
}

// 摄像头数据存在前端
const otherDevices = ShiPingData;

const handleDeviceClick = (device: any) => {
  const data = JSON.parse(JSON.stringify(device));

  if (data.position.indexOf(",") > -1) {
    data.position = {
      yaw: data.position.split(",")[0],
      pitch: data.position.split(",")[1],
    };
  }
  emitter.emit("clickDevice", data);
};
</script>

<style lang="scss" scoped>
.device {
  .wrap {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    gap: 10px;

    &::-webkit-scrollbar {
      display: none;
    }

    // 新增下拉框样式
    .dropdown-container {
      display: inline-block;
      position: relative;
      vertical-align: middle;

      .dropdown-btn {
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 16px;
        color: #fff;
        cursor: pointer;
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        border-left: #43eef7 5px solid;
        background: linear-gradient(
          to right,
          rgba(0, 60, 139, 0.6) 0%,
          rgba(0, 9, 139, 0.3) 30%,
          rgba(0, 49, 139, 0.2) 100%
        );

        .arrow {
          transition: transform 0.3s ease;
          font-size: 12px;

          &.open {
            transform: rotate(180deg);
          }
        }
      }

      .dropdown-list {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-height: 106px;
        overflow: hidden auto;
        background-color: rgba($color: #000f50, $alpha: 1);
        border: 1px solid #254d5d;
        border-radius: 6px;
        box-sizing: border-box;
        margin-top: 4px;
        box-shadow: 0 2px 6px rgba(0, 4, 255, 0.1);
        list-style: none;
        padding: 0;
        z-index: 999;

        .dropdown-item {
          padding: 8px 10px;
          font-size: 13px;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #406096;
          }
        }

        /* 滚动条样式 - Webkit浏览器 */
        &::-webkit-scrollbar {
          width: 6px;
          /* 垂直滚动条宽度 */
          height: 6px;
          /* 水平滚动条高度 */
        }

        &::-webkit-scrollbar-track {
          background: rgba(0, 15, 80, 0.3);
          /* 轨道颜色 */
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #406096;
          /* 滑块颜色 */
          border-radius: 3px;

          &:hover {
            background: #5076b6;
            /* 鼠标悬停时的滑块颜色 */
          }
        }
      }
    }

    // 下拉动画
    .slide-fade-enter-active,
    .slide-fade-leave-active {
      transition: all 0.25s ease;
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }

    .slide-fade-enter-to,
    .slide-fade-leave-from {
      opacity: 1;
      transform: translateY(0);
    }

    // 非分组设备
    .device-container {
      margin-top: 20px;
    }

    .device-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-flow: wrap;
      justify-content: space-between;
      align-items: stretch;
    }

    .device-item {
      width: 25%;
      padding: 8px;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      height: 32px;
      min-height: 32px;
      box-sizing: border-box;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      border-left: #43eef7 5px solid;
      background: linear-gradient(
        to right,
        rgba(0, 60, 139, 0.6) 0%,
        rgba(0, 9, 139, 0.3) 30%,
        rgba(0, 49, 139, 0.2) 100%
      );

      .arrow {
        transition: transform 0.3s ease;
        font-size: 12px;

        &.open {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
