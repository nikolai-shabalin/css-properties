import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    css: {
      devSourcemap: true
    }
  },
  build: {
    inlineStylesheets: 'always'
  }
});
