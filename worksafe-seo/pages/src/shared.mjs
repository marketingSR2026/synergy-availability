// Shared helpers for WorkSafe page templates. No dependencies.
// Every WorkSafeBC or Synergy fact goes through claim(), so the build can trace it to data/claims-register.csv.

export const SITE = 'https://synergyrehabilitation.ca';
export const PILLAR_PATH = '/worksafe-physiotherapy/';
export const GUIDE_PATH = '/worksafebc-physiotherapy-what-is-covered/';
export const RTW_PATH = '/return-to-work-after-a-workplace-injury/';

// Official WorkSafeBC pages cited on the pages (URLs from data/claims-register.csv).
export const SOURCES = {
  benefits: { title: 'Health care benefits (workers)', url: 'https://www.worksafebc.com/en/claims/benefits-services/health-care-benefits' },
  report: { title: 'How workers report a workplace injury or illness', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/how-workers-report-workplace-injury-illness' },
  manual: { title: 'Physiotherapy Services Reference Manual', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-reference-manual?lang=en' },
  providers: { title: 'Contracted MSK physiotherapy provider lists', url: 'https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services/contracted-musculoskeletal-physiotherapy-provider-lists' },
  massage: { title: 'Massage therapists: WorkSafeBC services', url: 'https://www.worksafebc.com/en/health-care-providers/provider-types/massage-therapists' },
};

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Small inline icon set (stroke icons drawn for this project; aria-hidden).
const P = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  back: '<path d="M12 3v18M8 7h8M7 12h10M8 17h8"/>',
  shoulder: '<circle cx="12" cy="6" r="3"/><path d="M5 21v-5a7 7 0 0 1 14 0v5"/>',
  hand: '<path d="M7 12V6a1.5 1.5 0 0 1 3 0v5M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V5.5a1.5 1.5 0 0 1 3 0V12M16 12V8.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L4 15.5a1.5 1.5 0 0 1 2.5-1.6L7 15"/>',
  neck: '<circle cx="12" cy="5" r="3"/><path d="M10 8v4M14 8v4M6 21l2-9h8l2 9"/>',
  fall: '<path d="M4 20h16M7 16l4-4 3 2 4-6"/><circle cx="17" cy="5" r="2"/>',
  knee: '<path d="M9 3v7l-2 5 2 6M15 3v7l2 5-2 6"/>',
  check: '<path d="M5 12l4 4 10-10"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M21 20a6 6 0 0 0-4-5.6"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
};
export const icon = (name, cls = 'sr-ws-icon') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;

// Analytics hooks (GTM click trigger on [data-sr-event]). Never add health or claim data here.
export const ev = (event, clinic, placement, pageType) =>
  `data-sr-event="${event}" data-clinic="${esc(clinic)}" data-placement="${placement}" data-page-type="${pageType}"`;

// Hours: "8AM-8:30PM" -> "8 AM to 8:30 PM"; grouped consecutive days.
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
const t12 = (t) => t.replace(/^(\d{1,2})(:\d\d)?(AM|PM)$/, (_, h, m, ap) => `${h}${m || ''} ${ap}`);
export const hoursText = (rng) => { const [a, b] = rng.split('-'); return `${t12(a)} to ${t12(b)}`; };
export function groupHours(hours) {
  const map = Object.fromEntries(hours.map((h) => [h.day, h.hours]));
  const rows = [];
  for (const d of DAYS) {
    const v = map[d] || 'Closed';
    const last = rows[rows.length - 1];
    if (last && last.v === v && DAYS.indexOf(d) === DAYS.indexOf(last.to) + 1) last.to = d; else rows.push({ from: d, to: d, v });
  }
  return rows.map((r) => ({ label: r.from === r.to ? r.from : `${r.from} to ${r.to}`, text: r.v === 'Closed' ? 'Closed' : hoursText(r.v) }));
}
const to24 = (t) => { const m = t.match(/^(\d{1,2})(?::(\d\d))?(AM|PM)$/); let h = +m[1] % 12; if (m[3] === 'PM') h += 12; return `${String(h).padStart(2, '0')}:${m[2] || '00'}`; };
export function openingSpec(hours) {
  return hours.map((h) => { const [a, b] = h.hours.split('-'); return { '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${FULL[h.day]}`, opens: to24(a), closes: to24(b) }; });
}
export const opensWeekends = (hours) => ['Sat', 'Sun'].filter((d) => hours.some((h) => h.day === d));
export const latestClose = (hours) => hours.map((h) => h.hours.split('-')[1]).sort((x, y) => to24(y).localeCompare(to24(x)))[0];

export const addressLine = (a) => `${a.unit ? `${a.unit}, ` : ''}${a.street}`;
export const mapsUrl = (c) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Synergy Rehab ${c.name}, ${c.address.street}, ${c.address.city}, BC ${c.address.postal}`)}`;

// Area groups for the clinic finder, west to east.
export const AREAS = [
  ['Vancouver and Burnaby', ['vancouver', 'burnaby']],
  ['New Westminster', ['new-westminster']],
  ['Richmond and Delta', ['richmond', 'delta']],
  ['Surrey', ['nordel-surrey', 'cedar-hills-surrey', 'central-city-surrey', 'king-george-surrey', 'strawberry-hill-surrey', 'newton-surrey', 'fleetwood-surrey', 'sullivan-heights-surrey', 'south-surrey', 'cloverdale-surrey', 'clayton-heights-surrey', 'clayton-corners-surrey']],
  ['Langley and Abbotsford', ['langley', 'abbotsford']],
];
