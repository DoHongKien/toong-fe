import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  // sockjs-client (CommonJS) references Node.js `global` — polyfill it for the browser
  define: {
    global: 'globalThis',
  },
});
