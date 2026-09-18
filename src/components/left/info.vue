<template>
  <div class="info-wrap">
    <div class="top">
      <div class="top-left">
        <div class="row row1">
          <div class="row-left">
            <img class="bg" src="../../assets/images/card/bg-3.png" alt="" />
            <img class="icon" src="../../assets/images/card/icon-5.png" alt="" />
          </div>
          <div class="row-right">
            <!-- <img class="bg" src="../assets/images/card/bg-2.png" alt="" /> -->
            <p class="text">宁波市鄞江镇沿山村</p>
          </div>
        </div>
        <div class="row row2">
          <div class="row-left">
            <img class="bg" src="../../assets/images/card/bg-3.png" alt="" />
            <img class="icon" src="../../assets/images/card/icon-6.png" alt="" />
          </div>
          <div class="row-right">
            <!-- <img class="bg" src="../assets/images/card/bg-2.png" alt="" /> -->
            <span class="text">总库容约45.9万m³</span>
          </div>
        </div>
      </div>
      <!-- <div class="top-right">
                <img class="bg" src="../assets/images/card/model.png" alt="" />
              </div> -->
    </div>
    <div class="bottom">
      <div class="col" v-for="(item, index) in deviceList" :key="index">
        <img class="icon" :src="getImageUrl(item.id)" alt="">
        <span class="name">{{ item.name }}</span>
        <span class="total">{{ item.total }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const getImageUrl = (id: number) => {
  return new URL(`../../assets/images/card/icon-type-bg-${id}.png`, import.meta.url).href
}

const deviceList = ref<any>([
  {
    id: 1,
    bg: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    icon: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    name: "GNSS",
    total: 15,
  },
  {
    id: 6,
    bg: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    icon: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    name: "渗压计",
    total: 9,
  },
  {
    id: 3,
    bg: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    icon: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    name: "水位计",
    total: 1,
  },
  {
    id: 4,
    bg: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    icon: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    name: "雨量计",
    total: 1,
  },
  {
    id: 7,
    bg: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    icon: new URL('@/assets/images/card/bg-icon.png', import.meta.url).href,
    name: "量水堰计",
    total: 1,
  }
]);
</script>

<style lang="scss" scoped>
.info-wrap {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  gap: 10px;
  width: 100%;
  height: 100%;

  .top {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: stretch;
    gap: 1em;
    width: 100%;
    height: 50%;

    .top-left {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: stretch;
      gap: 1em;

      .row {
        width: 95%;
        height: 60px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: stretch;

        .row-left {
          width: 30%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          position: relative;

          .bg {
            position: absolute;
            width: 90%;
            height: 90%;
            object-fit: scale-down;
          }

          .icon {
            position: absolute;
            width: 40%;
            height: 40%;
            object-fit: scale-down;
          }
        }

        .row-right {
          flex: 1;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          font-size: 1em;
          position: relative;
          background-image: url('@/assets/images/card/bg-2.png');
          background-size: 100% auto;
          background-repeat: no-repeat;
          background-position: center;

          .bg {
            position: absolute;
            width: 100%;
            height: 80%;
            z-index: 1;
            // object-fit: scale-down;
            // aspect-ratio: 5 / 1;
          }

          .text {
            font-size: 1em;
            font-weight: bold;
            color: #fff;
            z-index: 2;
          }
        }
      }
    }

    .top-right {
      width: 40%;
      height: 100%;

      .bg {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }

  .bottom {
    width: 100%;
    height: 50%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: stretch;
    gap: 0.5rem;

    .col {
      flex: 1 1 0;
      min-width: 0;
      background: linear-gradient(to bottom,
          rgba(4, 17, 32, 0.8) 0%,
          rgba(11, 42, 83, 0.4) 100%);
      border: 1px solid rgba(53, 135, 255, 0.6);
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(53, 135, 255, 0.3);
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-around;
      align-items: center;
      color: #fff;

      .icon {
        width: 80%;
        object-fit: contain;
      }

      .name {
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        font-size: 0.8rem;
      }

      .total {
        font-size: 1.4em;
        font-weight: bold;
        font-family: "YouSheBiaoTiHei";
        text-align: center;
        background: linear-gradient(to bottom,
            rgba(255, 196, 0, 0.8) 0%,
            rgba(255, 196, 0, 0.5) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>