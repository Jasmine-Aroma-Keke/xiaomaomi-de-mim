import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {rollupOptions:{output:{manualChunks(id){
    if(id.includes('/node_modules/zrender/'))return 'chart-renderer';
    if(id.includes('/node_modules/echarts/'))return 'charts';
  }}}},
  server: { port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:8000' } },
});
