import { defineConfig } from "nitro/config";

const preset = process.env.NETLIFY ? "netlify" : (process.env.NITRO_PRESET || "vercel");

export default defineConfig({
  preset,
  vercel: {
    functions: {
      runtime: "nodejs22.x",
    },
  },
});
