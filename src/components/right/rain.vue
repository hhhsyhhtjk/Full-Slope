<template>
  <ul class="rain-list">
    <li class="rain-item graph">
      <div class="container">
        <div class="scale"></div>
        <div class="battery">
        </div>
        <div class="battery-copy">
          <div class="g-wave"></div>
          <div class="g-wave"></div>
          <div class="g-wave"></div>
        </div>
      </div>
    </li>
    <li class="rain-item text">
      <div class="name">
        <span>小时雨量</span>
      </div>
      <div class="value">
        <span>{{ rainData.rain }}</span>
        <span>{{ rainData.rainUnit }}</span>
      </div>
      <div class="name">
        <span>当前状态</span>
      </div>
      <div class="value">
        <span>{{ rainData.rain < 10 ? '正常' : '异常' }}</span>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import { emitter } from '@/utils/eventBus';

const rainData = reactive({
  rain: 0,
  rainUnit: 'mm',
});

emitter.on('setSensorList', (data: any) => {
  if (data && data.length > 0) {
    data.forEach((item: any) => {
      if (item.sensorchildtype.includes("雨量计")) {
        rainData.rain = item.lastceliang;
        rainData.rainUnit = item.unit;
      }
    });
  }
});

onMounted(() => { });

onUnmounted(() => { });
</script>

<style lang="scss" scoped>
.rain-list {
  width: 100%;
  height: 100%;
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: stretch;
  gap: 10px;
  padding: 0;
  margin: 0;

  .rain-item {
    width: 50%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: stretch;
    padding: 10px;
    box-sizing: border-box;

    &.graph {
      position: relative;

      .scale {
        position: absolute;
        top: 0;
        left: 0;
        height: 95%;
        width: 30px;
        background-image:
          repeating-linear-gradient(to bottom, #666 0, #666 0.05em, transparent 0, transparent 4em),
          repeating-linear-gradient(to bottom, #666 0, #666 0.05em, transparent 0, transparent 2em),
          repeating-linear-gradient(to bottom, #666 0, #666 0.05em, transparent 0, transparent 1em);
        background-size: 10px 100%, 6px 100%, 4px 100%;
        background-repeat: no-repeat;
        background-position: 0 0.05em, 0 0.05em, 0 0.05em;
        // border-left: 1px solid transparent;
        // border-right: none;
        z-index: 999;
      }

      .container {
        position: relative;
        // width: 100%;
        height: 100%;
        aspect-ratio: 1/2;
        margin: auto;
      }

      .battery-copy {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0 0 5px 5px;
        overflow: hidden;
      }

      .battery {
        position: relative;
        height: 100%;
        box-sizing: border-box;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.22);
        background: #fff;
        z-index: 1;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 80%;
          background: linear-gradient(to bottom, #7abcff 0%, #00BCD4 44%, #2196F3 100%);
          border-radius: 0 0 10px 10px;
          box-shadow: 0 14px 28px rgba(33, 150, 243, 0), 0 10px 10px rgba(9, 188, 215, 0.08);
          animation: charging 10s linear infinite;
          filter: hue-rotate(90deg);
        }
      }

      .g-wave {
        position: absolute;
        width: 300px;
        height: 300px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 45% 47% 44% 42%;
        bottom: 25px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 1;
        animation: move 10s linear infinite;
      }

      .g-wave:nth-child(2) {
        border-radius: 38% 46% 43% 47%;
        transform: translate(-50%, 0) rotate(-135deg);
      }

      .g-wave:nth-child(3) {
        border-radius: 42% 46% 37% 40%;
        transform: translate(-50%, 0) rotate(135deg);
      }

      @keyframes charging {
        50% {
          box-shadow: 0 14px 28px rgba(0, 150, 136, 0.83), 0px 4px 10px rgba(9, 188, 215, 0.4);
        }

        95% {
          top: 5%;
          filter: hue-rotate(0deg);
          border-radius: 0 0 5px 5px;
          box-shadow: 0 14px 28px rgba(4, 188, 213, .2), 0 10px 10px rgba(9, 188, 215, 0.08);
        }

        100% {
          top: 0%;
          filter: hue-rotate(0deg);
          border-radius: 0 0 5px 5px;
          box-shadow: 0 14px 28px rgba(4, 188, 213, 0), 0 10px 10px rgba(9, 188, 215, 0.4);
        }
      }

      @keyframes move {
        100% {
          transform: translate(-50%, -50%) rotate(720deg);
        }
      }
    }

    .name {
      height: 4vh;
      line-height: 4vh;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      background-image: url('@/assets/images/card/water-title.png');
      background-size: auto 100%;
      background-repeat: no-repeat;
      background-position: center;
      font-size: 1em;
      color: #fff;
      text-align: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: normal;
      text-align: center;
      font-family: "PangMenZhengDao";
    }

    .value {
      flex: 1;
      // background-image: url('@/assets/images/card/rain-bg.png');
      // background-size: auto 100%;
      // background-repeat: no-repeat;
      // background-position: center;
      font-weight: bold;
      color: #fff;
      text-align: right;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: center;

      span {
        background: linear-gradient(45deg, #009c1a, #79ff6d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: "YouSheBiaoTiHei";
        // animation: float 3s ease-in-out infinite;
        display: inline-block;

        &:first-child {
          font-size: 1.5em;
        }

        &:last-child {
          font-size: 1.2em;
        }
      }
    }
  }
}
</style>