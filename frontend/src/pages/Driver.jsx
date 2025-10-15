import React, { useEffect, useMemo, useRef, useState } from "react";
import { Clock, MapPin, Route, Pointer, RefreshCcw, Play } from "lucide-react";
import { depot, pendingStops, computeGreedyRoute } from "../data/driverData";

export default function Driver() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [dateFilter, setDateFilter] = useState(pendingStops[0]?.date || "");
  const [selectMode, setSelectMode] = useState(false);
  const [areaStart, setAreaStart] = useState(null);
  const [areaEnd, setAreaEnd] = useState(null);
  const areaRectRef = useRef(null);
  const [pointsCount, setPointsCount] = useState(8);
  const [generatedStops, setGeneratedStops] = useState([]);
  const [started, setStarted] = useState(false);

  const stopsForDate = useMemo(() => pendingStops.filter((s) => s.date === dateFilter), [dateFilter]);

  const activeStops = useMemo(() => (generatedStops.length ? generatedStops : stopsForDate), [generatedStops, stopsForDate]);
  const routePoints = useMemo(() => computeGreedyRoute(activeStops, depot), [activeStops]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!mapInstance.current) {
      // eslint-disable-next-line no-undef
      mapInstance.current = L.map(mapRef.current).setView([depot.lat, depot.lng], 12);
      // eslint-disable-next-line no-undef
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);
    }

    // Clear existing markers and polyline
    markersRef.current.forEach((m) => mapInstance.current.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) {
      mapInstance.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    // Remove selection rectangle
    if (areaRectRef.current) {
      mapInstance.current.removeLayer(areaRectRef.current);
      areaRectRef.current = null;
    }

    // Draw selection rectangle if both corners chosen
    if (areaStart && areaEnd) {
      // eslint-disable-next-line no-undef
      areaRectRef.current = L.rectangle([areaStart, areaEnd], { color: "#16a34a", weight: 1, fillOpacity: 0.05 }).addTo(mapInstance.current);
    }

    // Add depot marker
    // eslint-disable-next-line no-undef
    const depotMarker = L.marker([depot.lat, depot.lng]).addTo(mapInstance.current).bindPopup(`<b>${depot.name}</b>`);
    markersRef.current.push(depotMarker);

    // Decide labels (numbered when started)
    const ordered = started ? routePoints.slice(1) : activeStops;
    const idToOrder = new Map();
    if (started) {
      ordered.forEach((p, i) => idToOrder.set(p.id, i + 1));
    }

    // Add stop markers
    ordered.forEach((s) => {
      if (started) {
        // eslint-disable-next-line no-undef
        const icon = L.divIcon({ className: "", html: `<div style="background:#16a34a;color:#fff;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid #14532d;font-weight:700;">${idToOrder.get(s.id)}</div>` });
        // eslint-disable-next-line no-undef
        const mk = L.marker([s.lat, s.lng], { icon }).addTo(mapInstance.current).bindPopup(`<b>${s.name || "Stop"}</b><br/>Type: ${s.type || "-"}${s.details?.bags !== undefined ? `<br/>Bags: ${s.details.bags}` : ""}${s.details?.notes ? `<br/>Notes: ${s.details.notes}` : ""}${s.window ? `<br/>Window: ${s.window}` : ""}`);
        markersRef.current.push(mk);
      } else {
        // eslint-disable-next-line no-undef
        const mk = L.marker([s.lat, s.lng]).addTo(mapInstance.current).bindPopup(`<b>${s.name || "Stop"}</b><br/>Type: ${s.type || "-"}${s.details?.bags !== undefined ? `<br/>Bags: ${s.details.bags}` : ""}${s.details?.notes ? `<br/>Notes: ${s.details.notes}` : ""}${s.window ? `<br/>Window: ${s.window}` : ""}`);
        markersRef.current.push(mk);
      }
    });

    // Fit bounds
    if (routePoints.length >= 2) {
      // eslint-disable-next-line no-undef
      const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
      mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
    }

    // Draw route polyline when started
    if (started && routePoints.length >= 2) {
      // eslint-disable-next-line no-undef
      polylineRef.current = L.polyline(routePoints.map((p) => [p.lat, p.lng]), { color: "#16a34a", weight: 4 }).addTo(mapInstance.current);
    }
  }, [activeStops, routePoints, started, areaStart, areaEnd]);

  // Map click for selecting area
  useEffect(() => {
    if (!mapInstance.current) return;
    function onClick(e) {
      if (!selectMode) return;
      const { lat, lng } = e.latlng;
      if (!areaStart) {
        setAreaStart([lat, lng]);
        setAreaEnd(null);
      } else if (!areaEnd) {
        setAreaEnd([lat, lng]);
        setSelectMode(false);
      }
    }
    mapInstance.current.on("click", onClick);
    return () => {
      if (mapInstance.current) mapInstance.current.off("click", onClick);
    };
  }, [selectMode, areaStart, areaEnd]);

  function randomBetween(min, max) { return Math.random() * (max - min) + min; }

  function generateRandomStops(count) {
    if (!(areaStart && areaEnd)) return [];
    const minLat = Math.min(areaStart[0], areaEnd[0]);
    const maxLat = Math.max(areaStart[0], areaEnd[0]);
    const minLng = Math.min(areaStart[1], areaEnd[1]);
    const maxLng = Math.max(areaStart[1], areaEnd[1]);
    const arr = [];
    for (let i = 0; i < count; i++) {
      const lat = randomBetween(minLat, maxLat);
      const lng = randomBetween(minLng, maxLng);
      const types = ["recycling", "general", "organic", "special"];
      const type = types[Math.floor(Math.random() * types.length)];
      const bags = Math.floor(Math.random() * 3) + 1;
      const notes = type === "special" ? "Bulky item" : "";
      arr.push({ id: `g-${Date.now()}-${i}-${Math.random().toString(36).slice(2,6)}`, name: `P${i+1}`, type, details: { bags, notes }, lat, lng, window: "-" });
    }
    return arr;
  }

  function handleGenerate() {
    const pts = generateRandomStops(pointsCount);
    if (pts.length) {
      setGeneratedStops(pts);
      setStarted(false);
    }
  }

  function handleRefresh() {
    const pts = generateRandomStops(pointsCount);
    if (pts.length) {
      setGeneratedStops((prev) => [...prev, ...pts]);
      setStarted(false);
    }
  }

  function handleStart() {
    if (activeStops.length === 0) return;
    setStarted(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 p-8 gap-6">
        {/* Left: Controls & list */}
        <aside className="w-80 bg-white p-6 rounded-xl shadow-inner h-fit">
          <h3 className="font-semibold mb-4">Collection Planner</h3>
          <div className="space-y-3 text-sm">
            <button className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${selectMode ? "bg-green-700 text-white" : "bg-green-600 text-white"}`} onClick={() => { setSelectMode(true); setAreaStart(null); setAreaEnd(null); }}>
              <Pointer size={16} /> Select Area on Map
            </button>
            <div className="flex items-center gap-2">
              <input type="number" min={1} className="w-24 border rounded-lg p-2" value={pointsCount} onChange={(e) => setPointsCount(parseInt(e.target.value || "0", 10))} />
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg" onClick={handleGenerate}>Generate</button>
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={handleRefresh} title="Add random points"><RefreshCcw size={16} /></button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white" onClick={handleStart}>
              <Play size={16} /> Start Navigation
            </button>
          </div>

          <div className="mt-5">
            <div className="text-xs text-gray-500 mb-2">Active Points ({activeStops.length})</div>
            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {activeStops.map((s, idx) => (
                <div key={s.id} className="border rounded-lg p-3">
                  <div className="font-medium flex items-center justify-between">
                    <span>{s.name || `Stop ${idx+1}`}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.type === "recycling" ? "bg-green-100 text-green-700" : s.type === "general" ? "bg-blue-100 text-blue-700" : s.type === "organic" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"}`}>{s.type || "-"}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><MapPin size={14} /> {s.lat.toFixed(4)}, {s.lng.toFixed(4)}</div>
                  {s.details && (
                    <div className="text-xs text-gray-600 mt-1">Bags: {s.details.bags ?? "-"}{s.details.notes ? ` • ${s.details.notes}` : ""}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Map */}
        <main className="flex-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2"><Route size={20} /> Driver Route</h2>
              <div className="text-sm text-gray-600">Stops: {activeStops.length}{started ? " • Navigation started" : ""}</div>
            </div>
            <div ref={mapRef} className="w-full h-[520px] rounded-lg border" />
          </div>
        </main>
      </div>
      <footer className="text-center text-gray-400 py-4 text-sm border-t bg-white">© 2025 EcoTrack</footer>
    </div>
  );
}


