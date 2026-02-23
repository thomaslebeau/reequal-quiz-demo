import { createVuetify } from 'vuetify'
import { defaults, reequal } from '@/styles/theme'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'reequal',
    themes: { reequal },
  },
  defaults,
})
