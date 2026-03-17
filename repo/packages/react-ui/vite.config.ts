import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'ReactUI',
      fileName: 'react-ui'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library. For web-components inside Angular, we might just want to bundle React with it!
      // So we leave external empty to bundle React!
    }
  }
})
