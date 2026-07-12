import { useEffect, useRef, useState } from "react";
import { GPSPoint } from "../types";

interface MapContainerProps {
  points: GPSPoint[];
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export default function MapContainer({
  points,
  center = [-23.4688, -46.8523], // Alphaville, SP as default demonstration coordinate
  zoom = 15,
  interactive = true,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Load Leaflet dynamically
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Check if script or CSS already exists
    const existingLink = document.querySelector('link[href*="leaflet.css"]');
    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector('script[src*="leaflet.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.crossOrigin = "";
      script.onload = () => setLeafletLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Leaflet from CDN");
        setLoadError(true);
      };
      document.body.appendChild(script);
    } else {
      // Script is present, wait for L to be available
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Initialize and Update Map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || loadError) return;

    const L = (window as any).L;
    if (!L) return;

    // Determine center coordinate
    let mapCenter: [number, number] = center;
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      mapCenter = [lastPoint.latitude, lastPoint.longitude];
    }

    // Create Map Instance if not created
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        dragging: interactive,
      }).setView(mapCenter, zoom);

      // Add dark tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(mapInstance.current);
    } else {
      // Center map if points change
      if (points.length > 0) {
        const lastPoint = points[points.length - 1];
        mapInstance.current.panTo([lastPoint.latitude, lastPoint.longitude]);
      }
    }

    const map = mapInstance.current;

    // Draw / Update Path Polyline
    if (points.length > 1) {
      const latlngs = points.map((p) => [p.latitude, p.longitude]);

      if (polylineRef.current) {
        polylineRef.current.setLatLngs(latlngs);
      } else {
        polylineRef.current = L.polyline(latlngs, {
          color: "#c7ff4a",
          weight: 5,
          opacity: 0.9,
          lineJoin: "round",
          className: "neon-path-line",
        }).addTo(map);

        // Add CSS filter for neon glow to map polyline
        const sheet = document.createElement("style");
        sheet.innerHTML = ".neon-path-line { filter: drop-shadow(0 0 8px rgba(199,255,74,0.7)); }";
        document.head.appendChild(sheet);
      }

      // Adjust map bounds to fit the route
      try {
        map.fitBounds(polylineRef.current.getBounds(), { padding: [30, 30] });
      } catch (e) {
        // Safe catch if bounds calculation fails on initial points
      }
    }

    // Setup Markers
    if (points.length > 0) {
      const startPoint = points[0];
      const endPoint = points[points.length - 1];

      // Start Marker (Green Dot)
      if (!startMarkerRef.current) {
        startMarkerRef.current = L.circleMarker([startPoint.latitude, startPoint.longitude], {
          radius: 6,
          fillColor: "#00e676",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup("Início do Percurso");
      }

      // Current / End Marker (Neon Glow)
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setLatLng([endPoint.latitude, endPoint.longitude]);
      } else {
        currentMarkerRef.current = L.circleMarker([endPoint.latitude, endPoint.longitude], {
          radius: 8,
          fillColor: "#c7ff4a",
          color: "#121513",
          weight: 3,
          fillOpacity: 1,
        })
          .addTo(map)
          .bindPopup("Posição Atual");
      }
    }

    return () => {
      // We keep the map instance alive, but cleanup markers/polylines if unmounted entirely
    };
  }, [leafletLoaded, points, center, zoom, interactive, loadError]);

  // Handle Clean Unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        polylineRef.current = null;
        startMarkerRef.current = null;
        currentMarkerRef.current = null;
      }
    };
  }, []);

  if (loadError || !navigator.onLine) {
    // Elegant fallback view when map loading fails or user is offline
    return (
      <div className="w-full h-full relative bg-[#172019] border border-white/5 rounded-[22px] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#c7ff4a_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-[#c7ff4a] text-xl font-bold border border-white/10 shadow-lg">
            🗺️
          </div>
          <h4 className="text-white font-semibold text-lg mb-2">Visualização da Rota (Offline)</h4>
          <p className="text-[#9ca39d] text-sm max-w-sm mb-4">
            GPS funcionando localmente. Mapa real indisponível sem conexão. Exibindo rota de treino simulada de Alphaville, SP.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#121513] border border-[#c7ff4a]/20 px-3 py-1.5 rounded-full text-xs text-[#c7ff4a]">
            <span className="w-2 h-2 rounded-full bg-[#c7ff4a] animate-pulse"></span>
            GPS Ativo: {points.length} pontos capturados
          </div>
        </div>

        {/* Mock visual route overlay */}
        <div className="absolute inset-x-8 bottom-8 h-1/4 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 30" fill="none">
            <path
              d="M10,15 Q30,5 50,20 T90,15"
              stroke="#c7ff4a"
              strokeWidth="3"
              strokeDasharray="4 4"
              className="animate-[dash_5s_linear_infinite]"
            />
            <circle cx="10" cy="15" r="4" fill="#00e676" />
            <circle cx="90" cy="15" r="5" fill="#c7ff4a" stroke="#121513" strokeWidth="2" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[22px] overflow-hidden relative border border-white/5 min-h-[310px]">
      {!leafletLoaded && (
        <div className="absolute inset-0 bg-[#121513] flex flex-col items-center justify-center gap-3 z-30">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-[#c7ff4a] animate-spin"></div>
          <span className="text-[#9ca39d] text-xs font-mono uppercase tracking-widest">Carregando Mapa Real...</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-[310px]" style={{ zIndex: 1 }} />
    </div>
  );
}
