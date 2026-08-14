import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Replace 'saathi-care' with your exact GitHub repo name.
  // If deploying to a custom domain or the root of username.github.io,
  // change this back to '/'.
  base: "/saathi-care/",
  server: {
    port: 5173,
    open: true,
  },
});
