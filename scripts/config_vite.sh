# Generates a vite.config.ts file for deploying to github pages
echo "import { defineConfig } from 'vite'; \
import react from '@vitejs/plugin-react';  \
export default defineConfig({ \
  plugins: [react()], \
  base: '/$1', \
})" > ../vite.config.ts
