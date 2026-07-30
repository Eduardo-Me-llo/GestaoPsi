import { defineConfig } from "nitro/config";

export default defineConfig({
  preset: "vercel",
  vercel: {
    functions: {
      runtime: "nodejs22.x",
    },
  },
});
