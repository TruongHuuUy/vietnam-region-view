import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["leaflet/dist/leaflet.css", "~/assets/styles/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false, // Chạy ở chế độ SPA (tĩnh)
  app: {
    baseURL: "/vietnam-region-view/", // Thay 'ten-repository' bằng tên repo của bạn
  },
  nitro: {
    preset: "static", // Xuất tĩnh
  },
});
