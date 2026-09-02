export function asset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function siteUrl(path = "/") {
  const origin = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized === "/" ? "" : normalized}`;
}

export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function googleCalendarUrl(opts: {
  title: string;
  date: string;
  time?: string;
  location?: string;
  details?: string;
}) {
  const start = toCalStamp(opts.date, opts.time ?? "16:00");
  const end = toCalStamp(opts.date, opts.time ?? "16:00", 6);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${start}/${end}`,
    location: opts.location ?? "",
    details: opts.details ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function toCalStamp(date: string, time: string, extraHours = 0) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
  dt.setHours(dt.getHours() + extraHours);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}
