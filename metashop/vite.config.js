import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
// vite.config.js
import ViteComponents, {
  AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";

export default {
  plugins: [
    /* ... */
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
  server: {
    port: 8080, //vite项目启动时自定义端口
    proxy: {
      "/webapi": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
