import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["leaflet/dist/leaflet.css", "~/assets/styles/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false,
  app: {
    baseURL: "/vietnam-region-view/",
    buildAssetsDir: "assets",
  },
  nitro: {
    preset: "static",
  },
});
