<script setup lang="ts">
import geojsonRaw from "~/assets/data/vung-dia-ly.json";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection } from "geojson";

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

const getProvinceStyle = (feature: any) => {
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
};

const bindProvincePopup = (feature: any, layer: any) => {
  const props = feature.properties || {};
  layer.bindPopup(`
    <strong>${props["Tỉnh thành mới"] || "Không rõ"}</strong><br/>
    Hành chính: ${props["TT hành chính"] || "—"}<br/>
    Dân số: ${props["Dân số"]?.toLocaleString?.() || "—"}<br/>
    GRDP: ${props["GRDP 2024 (tỷ VND)"]?.toLocaleString?.() || "—"} tỷ VND
  `);
};

onMounted(async () => {
  if (!process.client || !mapRef.value) return;

  // Import Leaflet chỉ phía client
  L = await import("leaflet");

  const geojsonData = geojsonRaw as FeatureCollection;

  // Khởi tạo bản đồ
  const map = L.map(mapRef.value).setView([10.2, 105.2], 8);

  // ✅ Tile nền: ArcGIS (đẹp, chất lượng, thân thiện chủ quyền)
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "© Esri & contributors",
      maxZoom: 19,
    }
  ).addTo(map);

  // ✅ Overlay thông tin chủ quyền Việt Nam
  L.marker([16.5, 111.5])
    .addTo(map)
    .bindTooltip("Quần đảo Hoàng Sa (Việt Nam)", {
      permanent: true,
      direction: "top",
      className:
        "text-red-600 font-bold bg-white border border-red-400 p-1 rounded",
    });

  L.marker([10.5, 114.5])
    .addTo(map)
    .bindTooltip("Quần đảo Trường Sa (Việt Nam)", {
      permanent: true,
      direction: "top",
      className:
        "text-red-600 font-bold bg-white border border-red-400 p-1 rounded",
    });

  // ✅ Hiển thị GeoJSON các tỉnh/thành
  const geoLayer = L.geoJSON(geojsonData, {
    style: getProvinceStyle, // Hàm style riêng theo tỉnh
    onEachFeature: bindProvincePopup, // Hàm popup riêng
  });

  geoLayer.addTo(map);

  // ✅ Zoom tự động
  map.fitBounds(geoLayer.getBounds());
});
</script>

<template>
  <div ref="mapRef" class="w-full h-screen" />
</template>
