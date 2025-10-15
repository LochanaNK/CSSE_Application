export function getInitialSchedules(baseDate = new Date()) {
  const y = baseDate.getFullYear();
  const m = baseDate.getMonth();
  return [
    { id: "s1", date: new Date(y, m, 3), type: "recycling", time: "8:00 AM", status: "Confirmed" },
    { id: "s2", date: new Date(y, m, 10), type: "general", time: "9:30 AM", status: "Scheduled" },
    { id: "s3", date: new Date(y, m, 15), type: "recycling", time: "8:15 AM", status: "Confirmed" },
    { id: "s4", date: new Date(y, m, 18), type: "general", time: "9:30 AM", status: "Scheduled" },
  ];
}


