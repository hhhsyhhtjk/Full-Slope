<template>
  <div class="device">
    <div class="wrap">
      <!-- 非分组设备 -->
      <div class="device-list">
        <div v-for="(device, index) in otherDevices" :key="index" class="device-item"
          @click="handleDeviceClick(device)">
          <span>{{ device.sensorselfno }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { emitter } from '@/utils/eventBus';

// 模拟设备数据
const devices = ref([]);

const dropdowns = reactive({
  GNSJ: false,
  GNSS: false,
  UP: false,
});



const handleClickOutside = (event: MouseEvent) => {
  const targets = document.querySelectorAll('.dropdown-container');
  if (![...targets].some((el) => el.contains(event.target as Node))) {
    dropdowns.GNSS = dropdowns.UP = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));


const otherDevices = ref([]);

const processDevices = (data: any) => {
  devices.value = data;
  devices.value = data.filter((d: any) => !d.name?.startsWith('GNSJ'));
  console.log('接收到设备列表:', devices.value);

  otherDevices.value = devices.value.filter(item => item.type != 'sp');

  console.log('处理后的设备列表:', {

    otherDevices: otherDevices.value,
  });
};

const handleDeviceClick = (device: any) => {
  console.log('点击设备:', device);
  emitter.emit('clickDevice', device);
};

emitter.on('setSensorList', (data: any) => {
  processDevices(data);
});
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
        background: linear-gradient(to right,
            rgba(0, 60, 139, 0.6) 0%,
            rgba(0, 9, 139, 0.3) 30%,
            rgba(0, 49, 139, 0.2) 100%);

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
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: stretch;
      gap: 10px;
    }

    .device-item {
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
      width: 100%;
      height: 32px;
      min-height: 32px;
      box-sizing: border-box;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      gap: 10px;
      border-left: #43eef7 5px solid;
      background: linear-gradient(to right,
          rgba(0, 60, 139, 0.6) 0%,
          rgba(0, 9, 139, 0.3) 30%,
          rgba(0, 49, 139, 0.2) 100%);

      span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

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
