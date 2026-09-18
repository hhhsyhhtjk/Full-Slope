<template>
  <div class="main">
    <app-header class="app-header"></app-header>

    <div class="vr-wrap">
      <app-viewer class="app-viewer"></app-viewer>
    </div>

    <app-footer class="app-footer"></app-footer>

    <app-aside-left
      class="app-aside aside-left"
      v-show="showAside"
      direction="ltr"
    ></app-aside-left>

    <app-aside-right
      class="app-aside aside-right"
      v-show="showAside"
      direction="rtl"
    ></app-aside-right>
  </div>
</template>

<script lang="ts" setup>
//*=================*感*谢*支*持*正*版*===============*//*
//  【原创归属声明】 本源码唯一原创作者：闲鱼「向上的阳光李子」
//     官方唯一售卖链接： 【闲鱼】https://m.tb.cn/h.hDfcLsq?tk=ngqH4NcKCjo CZ193
//     （点击直接打开，含更多优质源码） 💡 授权说明： 允许学习 /
//     二次开发（二创可售），严禁原封不动二次售卖 💰 价格说明： 本店源码 10-35
//     元，性价比亲民。
//     若遇盗版高价，实属遗憾；若遇更低价格，完全理解，望大家拿到靠谱源码。 📞
//     定制服务： WWXX：zhoulaoban00 承接各类定制开发，价格公道，童叟无欺
//     支持：数字孪生大屏、three.js、Cesium、小程序、APP
//     恳请支持原创，微小改动也是尊重 侵权必究，感谢理解！
//*=================*承*接*各*类*定*制*开*发*===============*//*
import { ref, onMounted } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import { useAppStore } from "../stores/index";
// import { storeToRefs } from "pinia";
import appHeader from "../components/Header.vue";
import appFooter from "../components/Footer.vue";
import appAsideLeft from "../components/AsideLeft.vue";
import appAsideRight from "../components/AsideRight.vue";
import appViewer from "../components/Viewer.vue";

// import { useRouter } from "vue-router";
// const router = useRouter();

// const { app } = storeToRefs(useAppStore());
// const { setTheme } = useAppStore();

const showAside = ref<boolean>(false);

onMounted(() => {
  setTimeout(() => {
    showAside.value = true;
  }, 1500);
});
</script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

  .app-header {
    z-index: 12;
    position: absolute;
    top: 0;
    left: 0;
  }

  .app-aside {
    width: 20vw;
    height: calc(100vh - 10vh);
    z-index: 11;
    position: absolute;
    top: 6vh;

    &.aside-left {
      left: 0;
    }

    &.aside-right {
      right: 0;
    }
  }

  .app-footer {
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 13;
  }

  .vr-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;

    .app-viewer {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .app-scroller {
      width: 100%;
      height: 100px;
      position: absolute;
      bottom: 40px;
      left: 0;
      z-index: 11;
    }
  }
}
</style>
