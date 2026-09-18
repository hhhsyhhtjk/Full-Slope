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
        { yaw: -0.38, pitch: 0.16 },
        { yaw: -0.19, pitch: -0.02 },
        { yaw: 0, pitch: 0.18 },
        { yaw: 0.19, pitch: -0.02 },
        { yaw: 0.38, pitch: 0.16 },
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
        const labelPositionClass =
          item.sensorselfno === "C9003"
            ? " marker-c9003"
            : item.sensorselfno === "球机1层1"
            ? " marker-spherical-camera"
            : "";
        const updatedMarker = {
          ...item,
          type: getDeviceType(item),
          className: `marker-${item.id}${labelPositionClass}`,
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

const escapeHtml = (value: any) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] || character
  );

const getCameraDemoMarkup = (marker: any) => {
  const cameraName = escapeHtml(marker.sensorselfno || "未命名");
  const isDomeCamera = String(marker.sensorselfno || "").includes("球机");
  const cameraType = isDomeCamera ? "球机" : "枪机";
  const cameraClass = isDomeCamera
    ? "camera-demo--dome"
    : "camera-demo--gun";
  const demoBaseUrl = import.meta.env.BASE_URL;

  return `
    <div class="camera-demo ${cameraClass}">
      <div class="camera-demo-topbar">
        <span class="camera-demo-live"><i></i>LIVE DEMO</span>
        <span>${cameraType} · ${cameraName}</span>
      </div>
      <div class="camera-demo-scene" aria-label="${cameraType}演示画面">
        <div class="camera-demo-gallery">
          <img src="${demoBaseUrl}camera-demo/slope-road-day.png" alt="山路边坡实景" />
          <img src="${demoBaseUrl}camera-demo/retaining-wall-road.png" alt="挡墙道路实景" />
          <img src="${demoBaseUrl}camera-demo/rainy-slope-road.png" alt="雨后边坡实景" />
        </div>
        <div class="camera-demo-grid"></div>
        <div class="camera-demo-sweep"></div>
        <div class="camera-demo-crosshair"><span></span></div>
        <div class="camera-demo-hud camera-demo-hud--left">
          <span>STATUS: ONLINE</span>
          <span>MODE: AUTO</span>
        </div>
        <div class="camera-demo-hud camera-demo-hud--right">
          <span>${isDomeCamera ? "PAN 128°" : "FIXED VIEW"}</span>
          <span>ZOOM 4.0X</span>
        </div>
        <div class="camera-demo-timestamp">2026-09-18&nbsp;&nbsp;18:35:59</div>
      </div>
      <div class="camera-demo-footer">
        <span><b></b>实景轮播</span>
        <span>${isDomeCamera ? "360°巡航" : "定点监测"}</span>
        <span>信号 98%</span>
      </div>
    </div>
  `;
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
      const cameraName = escapeHtml(marker.sensorselfno ?? "未命名");
      const videoContent = marker.url
        ? `<easy-player ref="videoplay" video-url="${escapeHtml(
            marker.url
          )}"></easy-player>`
        : getCameraDemoMarkup(marker);
      content = `
        <article class="tooltip-wrap">
          <div class="water">
            <p><strong>名称：${cameraName}</strong></p>
            <div class="video-wrap">
              ${videoContent}
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
  --marker-offset-y: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: max-content;
  height: auto;
  line-height: 1.2;
  text-align: center;
  transform: translateY(calc(-4px + var(--marker-offset-y)));
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

/* C9003 与球机1层1处于相邻视线，整体移动图标和标签，避免两者错位。 */
.psv-marker.marker-c9003 .sensor-marker {
  --marker-offset-y: -18px;
}

.psv-marker.marker-spherical-camera .sensor-marker {
  --marker-offset-y: 18px;
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

.camera-demo {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #dffcff;
  border: 1px solid rgba(96, 234, 255, 0.75);
  border-radius: 4px;
  background: #061b2a;
  box-shadow: inset 0 0 24px rgba(0, 196, 255, 0.2), 0 0 12px rgba(0, 0, 0, 0.35);
  font-family: "TencentSans-W7", "Microsoft YaHei", sans-serif;
}

.camera-demo-topbar,
.camera-demo-footer {
  height: 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: rgba(3, 25, 40, 0.9);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.camera-demo-live {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #8ffcff;
}

.camera-demo-live i,
.camera-demo-footer b {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #47f4c7;
  box-shadow: 0 0 8px #47f4c7;
}

.camera-demo-scene {
  position: relative;
  height: calc(100% - 60px);
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #0d5570 0%, #123e46 49%, #182c29 50%, #071a1a 100%);
}

.camera-demo--gun .camera-demo-scene {
  background: linear-gradient(180deg, #143e62 0%, #0d3447 48%, #172f32 49%, #06191b 100%);
}

.camera-demo-sky,
.camera-demo-slope,
.camera-demo-vegetation,
.camera-demo-gallery,
.camera-demo-grid,
.camera-demo-sweep,
.camera-demo-crosshair,
.camera-demo-hud,
.camera-demo-timestamp {
  position: absolute;
}

.camera-demo-gallery {
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #102d34;
}

.camera-demo-gallery::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 21, 30, 0.05), rgba(2, 21, 30, 0.28));
  pointer-events: none;
}

.camera-demo-gallery img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: camera-demo-gallery-cycle 15s linear infinite;
}

.camera-demo-gallery img:nth-child(1) {
  animation-delay: 0s;
}

.camera-demo-gallery img:nth-child(2) {
  animation-delay: 5s;
}

.camera-demo-gallery img:nth-child(3) {
  animation-delay: 10s;
}

.camera-demo-sky {
  inset: 0;
  opacity: 0.55;
  background:
    radial-gradient(circle at 18% 25%, rgba(144, 240, 255, 0.28) 0 2px, transparent 3px),
    radial-gradient(circle at 78% 18%, rgba(144, 240, 255, 0.22) 0 2px, transparent 3px),
    linear-gradient(130deg, transparent 0 46%, rgba(132, 226, 239, 0.16) 47% 48%, transparent 49% 100%);
}

.camera-demo-slope {
  left: -8%;
  right: -8%;
  bottom: 16%;
  height: 54%;
  opacity: 0.9;
  transform: skewY(-8deg);
  background:
    linear-gradient(145deg, transparent 0 22%, rgba(93, 182, 151, 0.42) 23% 24%, transparent 25% 34%, rgba(49, 124, 102, 0.68) 35% 37%, transparent 38%),
    linear-gradient(160deg, #2c7d5b 0%, #164e44 41%, #0b2d2d 78%);
}

.camera-demo-vegetation {
  left: -10%;
  right: -10%;
  bottom: 0;
  height: 43%;
  opacity: 0.8;
  background:
    radial-gradient(ellipse at 12% 70%, #6acb70 0 8%, transparent 9%),
    radial-gradient(ellipse at 30% 55%, #3b9d63 0 11%, transparent 12%),
    radial-gradient(ellipse at 53% 74%, #75be5b 0 10%, transparent 11%),
    radial-gradient(ellipse at 76% 51%, #2b8b60 0 13%, transparent 14%),
    linear-gradient(180deg, transparent 0%, rgba(3, 25, 20, 0.45) 100%);
  animation: camera-demo-vegetation-drift 7s ease-in-out infinite alternate;
}

.camera-demo-grid {
  inset: 0;
  z-index: 1;
  opacity: 0.24;
  background-image:
    linear-gradient(rgba(134, 244, 255, 0.24) 1px, transparent 1px),
    linear-gradient(90deg, rgba(134, 244, 255, 0.24) 1px, transparent 1px);
  background-size: 52px 42px;
}

.camera-demo-sweep {
  top: 0;
  bottom: 0;
  left: -12%;
  z-index: 2;
  width: 24%;
  opacity: 0.24;
  transform: skewX(-18deg);
  background: linear-gradient(90deg, transparent, rgba(76, 245, 255, 0.65), transparent);
  animation: camera-demo-sweep 4s ease-in-out infinite;
}

.camera-demo--gun .camera-demo-sweep {
  width: 2px;
  opacity: 0.8;
  transform: none;
  background: #8effff;
  box-shadow: 0 0 10px #8effff;
  animation: camera-demo-scan 3.2s linear infinite;
}

.camera-demo-crosshair {
  top: 50%;
  left: 50%;
  z-index: 3;
  width: 54px;
  height: 54px;
  border: 1px solid rgba(145, 255, 248, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 14px rgba(86, 244, 255, 0.35);
  animation: camera-demo-target 2.4s ease-in-out infinite;
}

.camera-demo-crosshair::before,
.camera-demo-crosshair::after,
.camera-demo-crosshair span::before,
.camera-demo-crosshair span::after {
  content: "";
  position: absolute;
  background: rgba(145, 255, 248, 0.9);
}

.camera-demo-crosshair::before,
.camera-demo-crosshair::after {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.camera-demo-crosshair::before {
  width: 76px;
  height: 1px;
}

.camera-demo-crosshair::after {
  width: 1px;
  height: 76px;
}

.camera-demo-crosshair span::before,
.camera-demo-crosshair span::after {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  box-shadow: 0 0 8px #fff;
}

.camera-demo-hud {
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  color: rgba(218, 255, 255, 0.85);
  font: 10px/1.2 "DS-DIGI", monospace;
  letter-spacing: 0.08em;
  text-shadow: 0 0 4px #00d9ff;
}

.camera-demo-hud--left {
  top: 8px;
  left: 8px;
}

.camera-demo-hud--right {
  top: 8px;
  right: 8px;
  align-items: flex-end;
}

.camera-demo-timestamp {
  left: 10px;
  bottom: 8px;
  z-index: 4;
  color: #d9ffff;
  font: 11px/1.2 "DS-DIGI", monospace;
  text-shadow: 0 0 4px #00d9ff;
}

.camera-demo-footer {
  color: rgba(223, 252, 255, 0.86);
  font-size: 11px;
}

.camera-demo-footer span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

@keyframes camera-demo-sweep {
  0% { left: -20%; }
  50% { left: 54%; }
  100% { left: 110%; }
}

@keyframes camera-demo-scan {
  0% { left: 0; opacity: 0; }
  12% { opacity: 0.8; }
  88% { opacity: 0.8; }
  100% { left: 100%; opacity: 0; }
}

@keyframes camera-demo-target {
  0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
}

@keyframes camera-demo-vegetation-drift {
  from { transform: translateX(-1.5%); }
  to { transform: translateX(1.5%); }
}

@keyframes camera-demo-gallery-cycle {
  0%, 29% { opacity: 1; }
  34%, 95% { opacity: 0; }
  100% { opacity: 1; }
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
