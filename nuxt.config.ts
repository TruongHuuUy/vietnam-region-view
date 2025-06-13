import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["leaflet/dist/leaflet.css", "~/assets/styles/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
