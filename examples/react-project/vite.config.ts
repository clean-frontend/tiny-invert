import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'tiny-invert': path.resolve(__dirname, '../../dist'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
})
