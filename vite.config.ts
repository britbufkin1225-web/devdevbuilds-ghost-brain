import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const graphThreePath = fileURLToPath(new URL("./node_modules/3d-force-graph/node_modules/three", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^three$/, replacement: graphThreePath }]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const moduleId = id.split("\\").join("/");

          if (moduleId.includes("node_modules/react-force-graph-3d") || moduleId.includes("node_modules/3d-force-graph")) {
            return "graph-vendor";
          }

          return undefined;
        }
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
