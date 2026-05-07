import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function Heatmap({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const heatPoints = data.map(p => [p.lat, p.lon, p.risk * 10]); // Scale intensity

    const layer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 13,
      gradient: {0.4: '#00ff41', 0.65: '#ffc107', 1.0: '#ff3131'}
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [data, map]);

  return null;
}

