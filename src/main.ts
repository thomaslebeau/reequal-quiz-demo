import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { useQuizStore } from '@/stores/quizStore'

import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

if (import.meta.env.DEV) {
  ;(window as any).__quizStore__ = useQuizStore()
}
