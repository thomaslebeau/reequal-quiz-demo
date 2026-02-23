import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import { useQuizStore } from '@/stores/quizStore'
import App from './App.vue'

import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

if (import.meta.env.DEV) {
  ;(window as any).__quizStore__ = useQuizStore()
}
