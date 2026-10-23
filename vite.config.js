import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

// three.js / R3F 는 동적 import 로만 불러오므로 자동으로 별도 지연 청크가 됩니다.
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  build: {
    target: 'es2022',
    modulePreload: { polyfill: false },
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: { groups: [{ name: 'three', test: /node_modules[\\/]three[\\/]/ }] },
      },
    },
  },
});
