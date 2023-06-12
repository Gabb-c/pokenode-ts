import { h } from 'vue'
import Theme from 'vitepress/theme'

import ReloadPrompt from './components/ReloadPrompt.vue'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'layout-bottom': () => h(ReloadPrompt)
    })
  }
}