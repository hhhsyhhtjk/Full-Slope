// directives/v-dialog.ts
import { createApp, DirectiveBinding, h } from 'vue'
import Dialog from '@/components/Dialog2.vue'

interface DialogOptions {
  title?: string
  content?: string
  width?: string
  topOffset?: string
  showHeader?: boolean
  showFooter?: boolean
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<DialogOptions>) {
    const app = createApp(Dialog, { ...binding.value })
    const container = document.createElement('div')
    document.body.appendChild(container)

    const instance = app.mount(container)

      // 把控制方法挂到 el 上，方便使用
      ; (el as any).__dialog__ = instance

    // 自动展示一次
    instance.show(binding.value)
  },
  unmounted(el: HTMLElement) {
    const instance = (el as any).__dialog__
    if (instance) {
      instance.close()
      instance.$el?.parentNode?.removeChild(instance.$el)
    }
  },
}
