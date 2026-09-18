import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
// import { parse, stringify } from 'zipson'

export const useAppStore = defineStore(
  'app',
  () => {
    const app = ref('Vue 3 + Vite + Pinia + Ts')

    const isInit = ref<boolean>(false);

    const setInit = (flag: boolean) => {
      isInit.value = flag;
    }

    const isDarkTheme = ref<boolean>(false);

    const setTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
    }

    const images = ref([]);

    const setImages = (value: any) => {
      images.value = value;
    }

    return { app, isDarkTheme, setTheme, images, setImages, isInit, setInit }
  },
  {
    persist: {
      key: 'app',
      storage: sessionStorage,
      // serializer: {
      //   deserialize: parse,
      //   serialize: stringify
      // }
    },
  }
)