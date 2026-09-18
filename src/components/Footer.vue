<template>
  <div class="footer">
    <!-- <img class="bg" src="@/assets/images/bg/bg-footer2.png" alt=""> -->
    <!-- <div class="wrap">
      <ul class="menu">
        <li class="menu-item" v-for="(item, index) in menuList" :key="index" :class="{ active: currentMenu === index }"
          @click="setPanorama(item, index)">
          <span class="label">{{ item.name }}</span>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { emitter } from '@/utils/eventBus';
import IMAGES from '@/utils/images.json';

const menuList = ref<any[]>([]);
const currentMenu = ref<number>(0);

const setPanorama = (item: any, index: number) => {
  currentMenu.value = index;
  emitter.emit('setPanorama', item);
};

onMounted(() => {
  menuList.value = IMAGES.scenes;

  // nextTick(() => {
  //   emitter.emit('setPanorama', currentMenu.value);
  // });
});
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 80px;
  text-align: center;
  $base-bg-color: rgb(38, 75, 112);
  background: linear-gradient(to top,
      rgba($base-bg-color, 0.8) 0%,
      rgba($base-bg-color, 0.6) 20%,
      rgba($base-bg-color, 0.4) 40%,
      rgba($base-bg-color, 0.2) 60%,
      rgba($base-bg-color, 0.1) 80%,
      rgba($base-bg-color, 0) 100%);

  .bg {
    // width: 60%;
    width: 100%;
    object-fit: contain;
  }

  .wrap {
    width: 60%;
    margin: 0 auto;

    .menu {
      list-style: none;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;

      .menu-item {
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        font-size: 0.8em;
        background-image: url("@/assets/images/card/bg-sence.png");
        background-size: 100% 100%;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &.active {
          background-image: url('@/assets/images/card/bg-sence_active.png');
          background-size: 100% 100%;
          color: #ffd000;
        }
      }
    }
  }
}
</style>