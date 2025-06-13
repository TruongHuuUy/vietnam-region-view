<template>
  <div ref="mapRef" class="w-full h-screen" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import "leaflet/dist/leaflet.css";

const mapRef = ref<HTMLDivElement | null>(null);
let L: typeof import("leaflet");

const colorPalette = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#00BCD4",
  "#E91E63",
];
const provinceColorMap = new Map<string, string>();
let colorIndex = 0;

onMounted(async () => {
  if (!process.client || !mapRef.value) return;

  L = await import("leaflet");

  const res = await fetch("/data/vung-dia-ly.json"); // file chứa nhiều vùng
  const geojsonData = await res.json();

  const map = L.map(mapRef.value).setView([10.2, 105.2], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const geoLayer = L.geoJSON(geojsonData, {
    style: (feature) => {
      const province = feature?.properties?.["Tỉnh thành mới"] || "";
      if (!provinceColorMap.has(province)) {
        const color = colorPalette[colorIndex % colorPalette.length];
        provinceColorMap.set(province, color);
        colorIndex++;
      }
      const fillColor = provinceColorMap.get(province) || "#ccc";
      return {
        color: "#333",
        fillColor,
        weight: 1.5,
        fillOpacity: 0.6,
      };
    },
    onEachFeature: (feature, layer) => {
      const props = feature.properties || {};
      layer.bindPopup(`
        <strong>${props["Tỉnh thành mới"] || "Không rõ"}</strong><br/>
        Hành chính: ${props["TT hành chính"] || "—"}<br/>
        Dân số: ${props["Dân số"]?.toLocaleString?.() || "—"}<br/>
        GRDP: ${props["GRDP 2024 (tỷ VND)"]?.toLocaleString?.() || "—"} tỷ VND
      `);
    },
  });

  geoLayer.addTo(map);

  // Zoom vừa đủ toàn bộ vùng
  map.fitBounds(geoLayer.getBounds());
});
</script>
