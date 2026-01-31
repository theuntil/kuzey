"use client";

import { useEffect, useMemo, useState } from "react";
import type { EarthquakeItem } from "./types";
import { fillForMag, radiusForMag } from "./utils";

type LatLngTuple = [number, number];

type RL = {
  MapContainer: any;
  TileLayer: any;
  CircleMarker: any;
  useMap: any;
};

function FlyToFocus({
  focus,
  useMap,
}: {
  focus: { lat: number; lon: number } | null;
  useMap: RL["useMap"];
}) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    if (!map) return;

    let cancelled = false;

    const run = () => {
      if (cancelled) return;

      // Map DOM gerçekten hazır mı?
      const container = typeof map.getContainer === "function" ? map.getContainer() : null;
      if (!container) return;

      // React 19 + Fast Refresh durumlarında 1 frame geciktir
      requestAnimationFrame(() => {
        if (cancelled) return;

        try {
          const z = typeof map.getZoom === "function" ? map.getZoom() : 6;
          map.flyTo([focus.lat, focus.lon], Math.max(z, 7), {
            animate: true,
            duration: 0.7,
          });
        } catch {
          // Map henüz tam init olmadıysa sessiz geç
        }
      });
    };

    // Leaflet hazır olunca çalıştır (en güvenlisi)
    if (typeof map.whenReady === "function") {
      map.whenReady(run);
    } else {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [focus?.lat, focus?.lon, map]);

  return null;
}

export default function EarthquakeMap({
  items,
  activeId,
  onSelect,
  center,
  focus,
}: {
  items: EarthquakeItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  center: { lat: number; lon: number };
  focus: { lat: number; lon: number } | null;
}) {
  const [rl, setRl] = useState<RL | null>(null);

  // react-leaflet'i sadece client'ta yükle (SSR/Turbopack crash önler)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const mod = await import("react-leaflet");
      if (cancelled) return;

      setRl({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        CircleMarker: mod.CircleMarker,
        useMap: mod.useMap,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const initialCenter = useMemo<LatLngTuple>(
    () => [center.lat, center.lon],
    [center.lat, center.lon]
  );

  // skeleton
  if (!rl) {
    return (
      <div className="h-[560px] w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="h-full w-full animate-pulse bg-gradient-to-b from-zinc-50 to-white" />
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, useMap } = rl;

  return (
    <div className="h-[560px] w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <MapContainer
        center={initialCenter}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <FlyToFocus focus={focus} useMap={useMap} />

        <TileLayer
          attribution={"© OpenStreetMap contributors"}
          url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        {items.map((eq) => {
          const isActive = eq.id === activeId;
          const r = radiusForMag(eq.mag);
          const fill = fillForMag(eq.mag);

          const markerCenter: LatLngTuple = [eq.lat, eq.lon];

          return (
            <CircleMarker
              key={eq.id}
              center={markerCenter}
              radius={isActive ? r + 2 : r}
              pathOptions={{
                color: "transparent",
                fillColor: fill,
                fillOpacity: isActive ? 0.95 : 0.75,
              }}
              eventHandlers={{
                click: () => onSelect(eq.id),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
