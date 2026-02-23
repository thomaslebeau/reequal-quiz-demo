import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'

import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
