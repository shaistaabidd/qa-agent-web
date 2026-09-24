import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(root, 'src/components'),
      '@pages': path.resolve(root, 'src/pages'),
      '@layouts': path.resolve(root, 'src/layouts'),
      '@routes': path.resolve(root, 'src/routes'),
      '@store': path.resolve(root, 'src/store'),
      '@services': path.resolve(root, 'src/services'),
      '@middleware': path.resolve(root, 'src/middleware'),
      '@graphql': path.resolve(root, 'src/utils/graphql'),
      '@utils': path.resolve(root, 'src/utils'),
      '@shared': path.resolve(root, 'src/shared'),
    },
  },
})
