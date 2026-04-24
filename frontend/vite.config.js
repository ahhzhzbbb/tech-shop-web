import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

function transformJsxInJs() {
  return {
    name: "transform-jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      if (!id.match(/src\/.*\.js$/)) {
        return null;
      }

      return await transformWithOxc(code, id, {
        lang: "jsx",
      });
    },
  };
}

export default defineConfig({
  plugins: [transformJsxInJs(), react()],
});
