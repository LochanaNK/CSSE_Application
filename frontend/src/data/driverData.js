export const depot = { id: "depot", name: "Depot", lat: 6.927079, lng: 79.861244 };

export const pendingStops = [
  { id: "c1", name: "Resident A", type: "recycling", details: { bags: 2, notes: "Paper & plastic" }, lat: 6.9147, lng: 79.9723, date: "2025-09-03", window: "8:00-10:00" },
  { id: "c2", name: "Resident B", type: "general", details: { bags: 1, notes: "Household waste" }, lat: 6.9051, lng: 79.8686, date: "2025-09-03", window: "9:00-11:00" },
  { id: "c3", name: "Resident C", type: "organic", details: { bags: 1, notes: "Yard trimmings" }, lat: 6.9381, lng: 79.8896, date: "2025-09-03", window: "10:00-12:00" },
  { id: "c4", name: "Resident D", type: "recycling", details: { bags: 3, notes: "Cardboard" }, lat: 6.9551, lng: 79.8653, date: "2025-09-03", window: "10:30-12:00" },
];

export function computeGreedyRoute(points, start = depot) {
  const remaining = [...points];
  const route = [start];
  let current = start;
  function distance(a, b) {
    const dx = a.lat - b.lat; const dy = a.lng - b.lng; return Math.sqrt(dx*dx + dy*dy);
  }
  while (remaining.length) {
    let bestIdx = 0; let best = remaining[0]; let bestD = distance(current, best);
    for (let i = 1; i < remaining.length; i++) {
      const d = distance(current, remaining[i]);
      if (d < bestD) { bestD = d; bestIdx = i; best = remaining[i]; }
    }
    route.push(best);
    current = best;
    remaining.splice(bestIdx, 1);
  }
  return route;
}


