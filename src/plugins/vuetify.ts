import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { reequal, defaults } from '@/styles/theme'

export default createVuetify({
  theme: {
    defaultTheme: 'reequal',
    themes: { reequal },
  },
  defaults,
})
