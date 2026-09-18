<template>
  <div class="main">
    <div id="viewer" ref="viewerRef"></div>
    <raining-scene id="raning" v-if="showRaining" :rainfall="rainingfall" />
    <div class="video-modal" v-if="videoModal.show">
      <div class="video-modal-title">
        {{ videoModal.data.sensorselfno }}
      </div>
      <div class="video-modal-close" @click="videoModal.show = false">x</div>
      <div class="video-modal-content">
        <easy-player ref="videoplay" :video-url="videoModal.data.url">
        </easy-player>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import { Viewer, utils } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { AutorotatePlugin } from "@photo-sphere-viewer/autorotate-plugin";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/compass-plugin/index.css";
import "@photo-sphere-viewer/gallery-plugin/index.css";
import { GetAllSensor } from "@/api/bigscreen";
import { emitter } from "@/utils/eventBus";
import RainingScene from "@/components/common/raining.vue";
import IMAGES from "@/utils/images.json";
import { reactive } from "vue";
import videoData from "@/components/right/sp.json";

const videoModal = reactive({
  show: false,
  data: {},
});

// import GNSSData from './gnss.json'
const { isInit } = storeToRefs(useAppStore());
const { setInit } = useAppStore();

setInit(false);

const showRaining = ref<boolean>(true);
const rainingfall = ref<number>(0);
const viewerRef = ref<HTMLElement | null>(null);
const scenes = ref<any[]>([]);
scenes.value.push(IMAGES.scenes[0]);

const animatedValues = {
  pitch: { start: -Math.PI / 2, end: -0.6 }, // 更低视角
  yaw: { start: 0, end: 0 }, // 水平方向不变
  zoom: { start: 0, end: 10 },
  maxFov: { start: 130, end: 90 },
  fisheye: { start: 2, end: 0 },
};

const panoramaViewer = ref<any>(null);
const gallery = ref<any[]>([]);
const autorotatePlugin = ref<any>(null);
const markersPlugin = ref<any>(null);
const loading = ref<boolean>(false);

// 全景图初始化
const initViewer = async () => {
  panoramaViewer.value = new Viewer({
    container: viewerRef.value as HTMLElement,
    panorama: scenes.value[0].panorama,
    caption: scenes.value[0].name,
    defaultPitch: animatedValues.pitch.start,
    defaultYaw: animatedValues.yaw.start,
    defaultZoomLvl: animatedValues.zoom.start,
    maxFov: animatedValues.maxFov.start,
    fisheye: animatedValues.fisheye.start,
    navbar: false,
    touchmoveTwoFingers: true,
    mousewheelCtrlKey: false,
    plugins: [
      [
        AutorotatePlugin,
        {
          autostart: false,
          autorotatePitch: "1deg",
          autorotateSpeed: 0.1,
          autostartDelay: Number.POSITIVE_INFINITY,
          autostartOnIdle: false,
        },
      ],
      [MarkersPlugin, {}],
    ],
    size: {
      width: "100%",
      height: "100%",
    },
  });
};

// 初始化插件
const initPlugins = () => {
  markersPlugin.value = panoramaViewer.value.getPlugin(MarkersPlugin);
  autorotatePlugin.value = panoramaViewer.value.getPlugin(AutorotatePlugin);
};

// const lookAt = (yaw: number, pitch: number) => {
//   panoramaViewer.value.animate({
//     yaw,
//     pitch,
//     zoom: 50,
//   }, {
//     speed: 2,
//     duration: 2000,
//     easing: 'inOutQuad',
//   });
// };

const lookAt = (yaw: number, pitch: number) => {
  const startPos = panoramaViewer.value.getPosition();
  const startZoom = panoramaViewer.value.getZoomLevel();

  new utils.Animation({
    properties: {
      yaw: { start: startPos.yaw, end: yaw },
      pitch: { start: startPos.pitch, end: pitch },
      zoom: { start: startZoom, end: 50 },
    },
    duration: 1000,
    easing: "inOutQuad",
    onTick: (props) => {
      panoramaViewer.value.rotate({ yaw: props.yaw, pitch: props.pitch });
      panoramaViewer.value.zoom(props.zoom);
    },
  });
};

const switchToImage = (id: string) => {
  const target = gallery.value.find((item) => Number(item.id) === Number(id));
  if (target) {
    markersPlugin.value.clearMarkers();
    panoramaViewer.value
      .setPanorama(target.panorama, {
        caption: target.name,
        position: target.markers?.[0]?.position || { yaw: 0, pitch: 0 },
        transition: {
          rotation: true,
          effect: "black",
        },
        zoom: 50,
      })
      .then(() => {
        if (target.markers?.length) {
          markersPlugin.value.setMarkers(target.markers);
        }
      });
  }
};

const introDuration = 2500;

const intro = (pitch: any, yaw: any) => {
  setInit(false);

  new utils.Animation({
    properties: {
      ...animatedValues,
      pitch: { start: animatedValues.pitch.start, end: pitch },
      yaw: { start: animatedValues.yaw.start, end: yaw },
    },
    duration: introDuration,
    easing: "inOutQuad",
    onTick: (properties) => {
      panoramaViewer.value.setOptions({
        fisheye: properties.fisheye,
        maxFov: properties.maxFov,
      });
      panoramaViewer.value.rotate({
        yaw: properties.yaw,
        pitch: properties.pitch,
      });
      panoramaViewer.value.zoom(properties.zoom);
    },
  }).then(() => {
    panoramaViewer.value.setOptions({
      mousemove: true,
      mousewheel: true,
    });

    setInit(true);
  });
};

// const reset = () => {
//   isInit.value = true;
//   autorotatePlugin.value.stop();
//   panoramaViewer.value.setOptions({
//     mousemove: false,
//     mousewheel: false,
//   });

//   new utils.Animation({
//     properties: {
//       pitch: { start: panoramaViewer.value.getPosition().pitch, end: animatedValues.pitch.start },
//       yaw: { start: panoramaViewer.value.getPosition().yaw, end: animatedValues.yaw.start },
//       zoom: { start: panoramaViewer.value.getZoomLevel(), end: animatedValues.zoom.start },
//       maxFov: { start: animatedValues.maxFov.end, end: animatedValues.maxFov.start },
//       fisheye: { start: animatedValues.fisheye.end, end: animatedValues.fisheye.start },
//     },
//     duration: 1500,
//     easing: 'inOutQuad',
//     onTick: (properties) => {
//       panoramaViewer.value.setOptions({
//         fisheye: properties.fisheye,
//         maxFov: properties.maxFov,
//       });
//       panoramaViewer.value.rotate({ yaw: properties.yaw, pitch: properties.pitch });
//       panoramaViewer.value.zoom(properties.zoom);
//     },
//   });
// };

const onMarkerClick = async (e: any) => {
  if (loading.value || e.marker.config.sensorchildtype.startsWith("GNSJ"))
    return;
  loading.value = true;
  try {
    clearTooltips();
    const markerConfig = { ...e.marker.config };
    markerConfig.tooltip = {
      content: generateTooltipContent(markerConfig),
      className: "custom-tooltip",
      position: "top",
      trigger: "click",
    };
    markersPlugin.value.updateMarker(markerConfig);
  } finally {
    loading.value = false;
  }
};

const parsePosition = (positionStr: string) => {
  // 检查输入是否为字符串格式
  if (typeof positionStr !== "string") {
    throw new Error('Input must be a string in format "yaw,pitch"');
  }

  // 去除可能的多余引号并分割字符串
  const cleanedStr = positionStr.replace(/"/g, "");
  const [yawStr, pitchStr] = cleanedStr.split(",");

  // 转换为数字
  const yaw = parseFloat(yawStr);
  const pitch = parseFloat(pitchStr);

  // 验证转换结果
  if (isNaN(yaw) || isNaN(pitch)) {
    throw new Error(
      'Invalid position format. Expected "yaw,pitch" with numbers'
    );
  }

  // 返回格式化后的对象
  return {
    yaw: yaw,
    pitch: pitch,
  };
};

const sensorList = ref<any>([]);

const getAllSensor = async () => {
  const res = await GetAllSensor();
  console.log("getAllSensor", res);
  const GNSJ = IMAGES.scenes[0].markers.filter((item) =>
    item.name.includes("GNSJ")
  );
  if (res.status === 200) {
    let data = res.data.result;
    data = [...data, ...videoData].filter((item: any, index: number, items: any[]) => {
      const key = `${item.type || item.sensorchildtype}|${item.sensorselfno}|${JSON.stringify(item.position)}`;
      return items.findIndex((candidate: any) => {
        const candidateKey = `${candidate.type || candidate.sensorchildtype}|${candidate.sensorselfno}|${JSON.stringify(candidate.position)}`;
        return candidateKey === key;
      }) === index;
    });
    // data = GNSSData;

    if (data && data.length > 0) {
      sensorList.value = [];
      markersPlugin.value.clearMarkers();

      GNSJ.forEach((item: any) => {
        const updatedMarker = {
          ...item,
          sensorselfno: item.name,
          type: getDeviceType(item),
          className: `marker-${item.id}`,
          anchor: "bottom center",
          sensorchildtype: "GNSJ全球导航卫星系统基站",
          html: `<div class="sensor-marker">
            <img width="32" height="32" src="${import.meta.env.BASE_URL}icons/icon-gnsj.png" />
            <span class="sensor-marker-label">${item.name}</span>
          </div>`,
        };
        sensorList.value.push(updatedMarker);
      });

      const videoMarkerOffsets = [
        { yaw: -0.18, pitch: 0.04 },
        { yaw: -0.09, pitch: 0.01 },
        { yaw: 0, pitch: -0.04 },
        { yaw: 0.09, pitch: 0.01 },
        { yaw: 0.18, pitch: 0.04 },
      ];

      data.forEach((item: any, index: number) => {
        const online = item.timeout === 0;
        const basePosition = parsePosition(item.position);
        const sameLocationIndex =
          item.type === "sp"
            ? data
                .slice(0, index)
                .filter(
                  (candidate: any) =>
                    candidate.type === "sp" &&
                    candidate.position === item.position
                ).length
            : -1;
        const offset =
          sameLocationIndex >= 0
            ? videoMarkerOffsets[sameLocationIndex] || { yaw: 0, pitch: 0 }
            : { yaw: 0, pitch: 0 };
        const updatedMarker = {
          ...item,
          type: getDeviceType(item),
          className: `marker-${item.id}`,
          anchor: "bottom center",
          position: {
            yaw: basePosition.yaw + offset.yaw,
            pitch: basePosition.pitch + offset.pitch,
          },
          html: `<div class="sensor-marker">
            <img width="32" height="32" src="${import.meta.env.BASE_URL}icons/icon-${getDeviceType(
            item
          )}-${online ? Math.abs(item.warnlevel) : "00"}.png" />
            <span class="sensor-marker-label">${
               !online ? "离线" : item.warnlevel ? "异常" : "正常"
             }(${item.sensorselfno})</span>
          </div>`,
        };
        sensorList.value.push(updatedMarker);
      });

      emitter.emit("setSensorList", sensorList.value);

      if (isInit.value) {
        markersPlugin.value.setMarkers(sensorList.value);
      } else {
        setTimeout(() => {
          markersPlugin.value.setMarkers(sensorList.value);
        }, introDuration + 1000);
      }
    }
  }
};

let sensorDataInterval: number | null = null;

const clearTooltips = () => {
  if (markersPlugin.value) {
    const markers = markersPlugin.value.getMarkers();
    markers.forEach((marker: any) => {
      markersPlugin.value.hideMarkerTooltip(marker.id);
    });
  }
};

const getDeviceType = (sensor: any) => {
  // 如果sensor对象不存在或者没有sensorchildtype属性，返回默认类型
  if (!sensor || !sensor.sensorchildtype) return "def";

  // 将sensorchildtype转为字符串并转为小写，避免大小写问题
  const type = String(sensor.sensorchildtype).toLowerCase();

  if (type.includes("渗压")) {
    return "up";
  } else if (type.includes("导航")) {
    return "gnss";
  } else if (type.includes("量水堰")) {
    return "lsy";
  } else if (type.includes("水位")) {
    return "sw";
  } else if (type.includes("雨量")) {
    return "yl";
  } else if (type.includes("视频")) {
    return "sp";
  }

  // 默认返回def类型
  return "def";
};

const convertGnssData = (lastceliang: any) => {
  if (typeof lastceliang !== "string") {
    return [0.0, 0.0, 0.0];
  }

  const parts = lastceliang.split("|");

  if (parts.length !== 3) {
    return [0.0, 0.0, 0.0];
  }

  const result = parts.map((part) => {
    const num = parseFloat(part.trim());
    return isNaN(num) ? 0.0 : num;
  });

  console.log("convertGnssData", result);

  return result;
};

const generateTooltipContent = (marker: any) => {
  if (!marker) return "暂无数据";

  let content = "";

  switch (marker.type) {
    case "gnss": // GNSS
      const [x, y, z] = convertGnssData(marker.lastceliang);
      console.log(x, y, z);
      content = `
        <article class="tooltip-wrap">
          <div class="gnss">
            <p><strong>名称：${marker.sensorselfno ?? "未命名"}</strong></p>
            <p>
              <span>东方向偏移值：${x}</span>
              <span>${marker.unit ?? ""}</span>
            </p>
            <p>
              <span>北方向偏移值：${y}</span>
              <span>${marker.unit ?? ""}</span>
            </p>
            <p>
              <span>垂直偏移值：${z}</span>
              <span>${marker.unit ?? ""}</span>
            </p>
            <p>采集时间：${marker.lastcaijitime ?? "无数据"}</p>
          </div>
        </article>
      `;
      break;
    case "sw": // 水位计
    case "yl": // 雨量计
    case "lsy": // 量水堰计
      content = `
        <article class="tooltip-wrap">
          <div class="water">
            <p><strong>名称：${marker.sensorselfno ?? "未命名"}</strong></p>
            <p>
              <span>监测值：${marker.lastceliang ?? "无数据"}</span>
              <span>${marker.unit ?? ""}</span>
            </p>
            <p>采集时间：${marker.lastcaijitime ?? "无数据"}</p>
          </div>
        </article>
      `;
      break;
    case "sp": // 视频站
      content = `
        <article class="tooltip-wrap">
          <div class="water">
            <p><strong>名称：${marker.sensorselfno ?? "未命名"}</strong></p>
            <div class="video-wrap">
               <easy-player ref="videoplay" video-url="${marker.url}">
                </easy-player>
            </div>
          </div>
        </article>
      `;
      break;
    default:
      content = `
        <article class="tooltip-wrap">
          <div>
            <p><strong>名称：${marker.sensorselfno ?? "未命名"}</strong></p>
            <p>
              <span>采集值：${marker.lastceliang ?? "无数据"}</span>
              <span>${marker.unit ?? ""}</span>
            </p>
            <p>采集时间：${marker.lastcaijitime ?? "无数据"}</p>
          </div>
        </article>
      `;
  }

  return content;
};

emitter.on("setPanorama", (e: any) => {
  console.log("setPanorama", e);
  switchToImage(e.id);
});

// 点击设备事件
emitter.on("clickDevice", async (markerConfig: any) => {
  // console.log('clickDevice', markerConfig);
  // if (markerConfig.type == 'sp') {
  //   videoModal.show = true
  //   videoModal.data = markerConfig
  //   return
  // } else {
  //   videoModal.show = false
  //   videoModal.data = {}
  // }
  if (!markerConfig || !markerConfig.position || !panoramaViewer.value) return;

  console.log("clickDevice", markerConfig);
  lookAt(markerConfig.position.yaw, markerConfig.position.pitch);

  setTimeout(async () => {
    try {
      loading.value = true;
      clearTooltips();

      // 更新并显示 tooltip
      markersPlugin.value.updateMarker({
        id: markerConfig.id,
        tooltip: {
          content: generateTooltipContent(markerConfig),
          className: "custom-tooltip",
          position: "top",
          trigger: "click",
        },
      });
      markersPlugin.value.showMarkerTooltip(markerConfig.id);

      // 添加手动关闭逻辑
      const closeTooltipOnClickOutside = (e: MouseEvent) => {
        const tooltip = document.querySelector(".psv-tooltip");
        if (tooltip && !tooltip.contains(e.target as Node)) {
          markersPlugin.value.hideMarkerTooltip(markerConfig.id);
          document.removeEventListener("click", closeTooltipOnClickOutside);
        }
      };

      // 延迟添加监听器以避免立即触发
      setTimeout(() => {
        document.addEventListener("click", closeTooltipOnClickOutside);
      }, 100);
    } catch (error) {
      console.error("处理标记点击出错:", error);
    } finally {
      loading.value = false;
    }
  }, 1000);
});

emitter.on("rainingfallChange", (val: number) => {
  rainingfall.value = val;
});

onMounted(async () => {
  await initViewer();

  initPlugins();

  getAllSensor();

  markersPlugin.value.addEventListener("select-marker", onMarkerClick);

  panoramaViewer.value.addEventListener(
    "ready",
    () => {
      autorotatePlugin.value.stop();
      setTimeout(() => {
        if (!isInit.value) {
          intro(animatedValues.pitch.end, animatedValues.yaw.end); // 传递正确的 yaw
        }
      }, 1000);
    },
    { once: true }
  );

  panoramaViewer.value.addEventListener("click", ({ data }) => {
    console.log("click", data);
    // 转成字符串格式
    const { pitch, yaw } = data;
    const position = `${yaw},${pitch}`;
    console.log("position:", position);
    if (!isInit.value) {
      intro(data.pitch, data.yaw);
    }
  });

  panoramaViewer.value.addEventListener("panorama-loaded", (e: any) => {
    console.log("panorama loaded:", e);
  });

  sensorDataInterval = window.setInterval(() => {
    getAllSensor();
  }, 60000);
});

onUnmounted(() => {
  // 移除 emitter 事件
  emitter.off("setPanorama");
  emitter.off("clickDevice");
  emitter.off("rainingfallChange");

  // 移除 markersPlugin 的事件
  if (markersPlugin.value) {
    markersPlugin.value.removeEventListener("select-marker", onMarkerClick);
  }

  // 移除 panoramaViewer 上的所有绑定事件
  if (panoramaViewer.value) {
    panoramaViewer.value.removeEventListener("ready");
    panoramaViewer.value.removeEventListener("click");
    panoramaViewer.value.removeEventListener("panorama-loaded");

    // 销毁 panoramaViewer 实例
    panoramaViewer.value.destroy();
    panoramaViewer.value = null;
  }

  // 清除定时器
  if (sensorDataInterval !== null) {
    clearInterval(sensorDataInterval);
    sensorDataInterval = null;
  }

  // 清空插件引用
  autorotatePlugin.value = null;
  markersPlugin.value = null;
});
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  user-select: none;

  // #viewer {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   z-index: 1;
  // }

  #raning {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }
}
</style>

<style>
.psv-gallery-item,
.psv-gallery-item-thumb {
  outline: none !important;
}

.psv-tooltip--top-center,
.psv-tooltip--bottom-center {
  box-shadow: none !important;
}

.psv-tooltip-arrow {
  display: none !important;
}

.psv-tooltip {
  background: none !important;
  color: #fff;
  background: url("@/assets/images/box/bg-dialog.png") no-repeat center center !important;
  background-size: 100% 100% !important;
  padding: 10px 20px;
}

.psv-marker img {
  display: block;
  margin: auto;
}

.psv-marker--normal {
  display: block !important;
  width: max-content !important;
  height: auto !important;
  overflow: visible !important;
}

.sensor-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: max-content;
  height: auto;
  line-height: 1.2;
  text-align: center;
  transform: translateY(-4px);
}

.sensor-marker > img {
  flex: 0 0 auto;
  display: block;
  margin: 0 !important;
}

.sensor-marker-label {
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
  white-space: nowrap !important;
  line-height: 1.2 !important;
  text-align: center;
  font-size: 14px;
  color: #fff;
  padding: 2px 6px !important;
  border: 1px solid rgba(154, 252, 255, 0.65);
  border-radius: 3px;
  background: rgba(0, 20, 36, 0.78);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}

.custom-tooltip {
  min-width: 300px;
  max-width: 100vw;
  min-height: 200px;
  max-height: 100vh;
  overflow: hidden;
}

.custom-tooltip .psv-tooltip-content {
  padding: 10px;
  padding-top: 30px;
  box-sizing: border-box;
  overflow: hidden;
}

.custom-tooltip img {
  width: 100%;
  border-radius: 4px 4px 0 0;
}

.custom-tooltip h2,
.custom-tooltip p {
  margin: 0;
  margin-bottom: 10px;
  text-align: justify;
}

.video-wrap {
  width: 550px;
  height: 350px;
}

.video-modal {
  width: 45vw;
  height: 60vh;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none !important;
  color: #fff;
  background: url("@/assets/images/box/bg-dialog.png") no-repeat center center !important;
  background-size: 100% 100% !important;
  padding: 40px;
}

.video-modal-title {
  margin: 20px;
  font-size: 32px;
}

.video-modal-content {
  margin-left: 4%;
  width: 95%;
  height: 86%;
}

.video-modal-close {
  position: absolute;
  right: 1vw;
  top: 0px;
  padding: 10rpx;
  border-radius: 10rpx;
  font-size: 1.8vw;
  cursor: pointer;
  color: #9afcff;
  opacity: 0.6;
}
</style>
