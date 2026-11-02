// Location page: /worksafe-physiotherapy/<clinic-slug>/ . WorkSafe only.
// Unique data comes from data/worksafe-locations.json; staff-only facts render through ctx.slot() and block publish when empty.
import { esc, icon, ev, SOURCES, PILLAR_PATH, groupHours, opensWeekends, latestClose, hoursText, addressLine, mapsUrl } from './shared.mjs';

const surrey = (x) => x.address.city === 'Surrey';

export function locationMeta(x) {
  const place = surrey(x) ? `${x.name}, Surrey` : x.name;
  let title = `WCB & WorkSafeBC Physio in ${place} | Synergy Rehab`;
  if (title.length > 62) title = `WCB & WorkSafeBC Physio in ${x.name} | Synergy Rehab`;
  const wk = groupHours(x.hours)[0];
  return {
    id: x.page_slug,
    path: `${PILLAR_PATH}${x.page_slug}/`,
    title,
    description: (() => {
      const base = `Hurt at work? Book a WCB physio assessment at Synergy Rehab ${x.name}, ${x.address.street}. Open ${wk.label} ${wk.text}.`;
      return base.length + 25 <= 160 ? `${base} Bring your claim number.` : base;
    })(),
    h1: `WorkSafeBC physiotherapy in ${x.area_label}`,
  };
}

function hoursTable(x) {
  return `<table class="sr-ws-hours"><caption class="sr-ws-sr-only">Opening hours at Synergy Rehab ${esc(x.name)}</caption><tbody>
    ${groupHours(x.hours).map((r) => `<tr><th scope="row">${r.label}</th><td>${r.text}</td></tr>`).join('')}</tbody></table>`;
}

export function locationFaq(x, ctx) {
  const c = ctx.claim;
  const wkend = opensWeekends(x.hours);
  const close = hoursText(`1AM-${latestClose(x.hours)}`).split(' to ')[1];
  const near = x.nearby.slice(0, 2);
  const massageNear = x.nearby.find((n) => ctx.bySlug[n.slug]?.wcb_massage_bookable);
  const qa = [];
  qa.push([`Is Synergy Rehab ${esc(x.name)} open evenings and weekends?`,
    `${wkend.length === 2 ? 'Yes. We are open 7 days a week' : wkend.length === 1 ? `We are open ${wkend[0] === 'Sat' ? 'Saturdays' : 'Sundays'}` : 'We are open weekdays only'}, and our latest closing time is ${close}. Full hours: ${groupHours(x.hours).map((r) => `${r.label} ${r.text}`).join('; ')}.`]);
  qa.push([`Can I book WCB massage therapy at ${esc(x.name)}?`,
    x.wcb_massage_bookable
      ? `${c('SYN-JANE', `Yes. WCB massage follow-up visits are bookable online at ${esc(x.name)}.`)} ${c('WSBC-35', 'WorkSafeBC massage needs a doctor&#8217;s referral and an accepted claim.')}`
      : `${c('SYN-JANE', `Not online at ${esc(x.name)} right now.`)}${massageNear ? ` ${c('SYN-JANE', `The nearest clinic that books WCB massage online is ${esc(massageNear.name)}, about ${massageNear.km} km away.`)}` : ''} ${c('WSBC-35', 'WorkSafeBC massage needs a doctor&#8217;s referral and an accepted claim.')}`]);
  qa.push([`Where do I park at ${esc(x.name)}?`, ctx.slot(x, 'parking', 'Parking: where to park, cost, time limits')]);
  qa.push([`Which languages do your ${esc(x.name)} physiotherapists speak?`, ctx.slot(x, 'languages', 'Languages spoken by WCB physiotherapists at this clinic')]);
  if (near.length) qa.push([`What if ${esc(x.name)} has no time that works for me?`,
    `${c('SYN-JANE', `Our nearest clinics also book WCB physio online: ${near.map((n) => `${esc(n.name)} (about ${n.km} km)`).join(' and ')}.`)} You can see every clinic on our <a href="${PILLAR_PATH}#clinics">WorkSafeBC physiotherapy page</a>.`]);
  return qa;
}

export function location(x, ctx) {
  const c = ctx.claim;
  const m = locationMeta(x);
  const wk = groupHours(x.hours);
  const tel = `tel:${x.phone_e164}`;
  const book = x.jane.wcb_initial_url;
  const wkend = opensWeekends(x.hours);
  const services = [
    ['WCB physio assessment', 'Your first visit: we assess the injury and build a plan around your job.', 'WSBC-11', 'You can have it while your claim is pending.'],
    ['WCB physio treatment visits', 'Hands-on care and exercise at follow-up visits.', 'WSBC-17', 'Funded visits start once your claim is accepted.'],
  ];
  if (x.wcb_massage_bookable) services.push(['WCB massage therapy', 'Follow-up massage visits on a WorkSafeBC claim.', 'WSBC-35', 'Needs a doctor&#8217;s referral and an accepted claim.']);
  if (x.wcb_acupuncture_bookable) services.push(['WCB acupuncture', 'Acupuncture visits on a WorkSafeBC claim.', 'WSBC-36', 'Needs an accepted claim. No referral needed.']);
  const faq = locationFaq(x, ctx);
  const nearbyCards = x.nearby.map((n) => {
    const t = ctx.bySlug[n.slug];
    if (!t) return '';
    const own = ctx.linked(t.page_slug);
    const href = own ? ctx.href(t) : t.jane.wcb_initial_url;
    return `<li class="sr-ws-card sr-ws-card--interactive sr-ws-loccard">
      <h3 class="sr-ws-h4 sr-ws-card__title"><a class="sr-ws-card__link" href="${esc(href)}" ${ev(own ? 'worksafe_location_select' : 'worksafe_book_click', t.page_slug, 'nearby', 'location')}>Synergy Rehab ${esc(t.name)}</a></h3>
      <p class="sr-ws-loccard__area">About ${n.km} km away<br>${esc(addressLine(t.address))}, ${esc(t.address.city)}</p>
      <span class="sr-ws-loccard__cta">${own ? `WorkSafe physio at ${esc(t.name)}` : `Book WCB physio at ${esc(t.name)}`}</span></li>`;
  }).join('\n');

  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${PILLAR_PATH}">WorkSafeBC physiotherapy</a></li><li><span aria-current="page">${esc(x.name)}</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">${c('SYN-01', 'WorkSafeBC contracted', 'span', x)}</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Synergy Rehab ${esc(x.name)}</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">WorkSafeBC physiotherapy in <span class="sr-ws-accent">${esc(x.area_label)}</span></h1>
        <p class="sr-ws-lede">Hurt at work? Book a WCB physio assessment at ${esc(addressLine(x.address))}, ${esc(x.address.city)}. ${c('WSBC-10', 'Tell us the injury happened at work')} and bring your claim number if you have one. ${c('SYN-08', 'We bill WorkSafeBC directly.', 'span', x)}</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'hero', 'location')}>Book a WCB assessment<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="${tel}" ${ev('worksafe_phone_click', x.page_slug, 'hero', 'location')}>${icon('phone')}Call ${esc(x.phone)}</a>
        </div>
        <ul class="sr-ws-proof" role="list"><li>${wk[0].label} ${wk[0].text}</li><li>${wkend.length === 2 ? 'Open 7 days' : wkend.length ? 'Open weekends' : 'Weekdays'}</li><li>19+ locations</li></ul>
      </div>
      <figure class="sr-ws-hero__media">
        ${ctx.photo(`${x.page_slug}_hero`, `Front entrance of Synergy Rehab ${esc(x.name)}`, 800, 1000, true, x)}
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">${icon('calendar')}</span><span><span class="sr-ws-minicard__value">Online</span><span class="sr-ws-minicard__label">WCB booking</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br"><span class="sr-ws-minicard__icon">${icon('clock')}</span><span><span class="sr-ws-minicard__value">Until ${hoursText(`1AM-${latestClose(x.hours)}`).split(' to ')[1]}</span><span class="sr-ws-minicard__label">latest closing</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--bl sr-ws-only-sm"><span class="sr-ws-minicard__icon">${icon('pin')}</span><span><span class="sr-ws-minicard__value">19+</span><span class="sr-ws-minicard__label">locations</span></span></li>
        </ul>
      </figure>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="visit" aria-labelledby="sr-ws-visit-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Find us</p><h2 class="sr-ws-h2" id="sr-ws-visit-h">Visit Synergy Rehab ${esc(x.name)}</h2></div>
    <div class="sr-ws-grid sr-ws-grid--2">
      <article class="sr-ws-card sr-ws-card--elevated sr-ws-location">
        <div class="sr-ws-location__head"><h3 class="sr-ws-h3 sr-ws-location__name">Synergy Rehab ${esc(x.name)}</h3><span class="sr-ws-pill">WCB booking online</span></div>
        <address class="sr-ws-location__addr">${esc(addressLine(x.address))}<br>${esc(x.address.city)}, BC ${esc(x.address.postal)}</address>
        <dl class="sr-ws-location__meta">
          <div><dt>Phone</dt><dd><a class="sr-ws-location__phone" href="${tel}" ${ev('worksafe_phone_click', x.page_slug, 'card', 'location')}>${esc(x.phone)}</a></dd></div>
          <div><dt>Getting here</dt><dd>${ctx.slot(x, 'getting_here', 'Transit stop or SkyTrain station, landmarks, building entrance and floor')}</dd></div>
          <div><dt>Accessibility</dt><dd>${ctx.slot(x, 'accessibility', 'Step-free entrance, elevator, accessible washroom')}</dd></div>
        </dl>
        <div class="sr-ws-location__actions">
          <a class="sr-ws-btn sr-ws-btn--primary" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'card', 'location')}>Book WCB physio at ${esc(x.name)}</a>
          <a class="sr-ws-link sr-ws-link--ext" href="${mapsUrl(x)}" ${ev('worksafe_directions_click', x.page_slug, 'card', 'location')}>Get directions</a>
        </div>
      </article>
      <article class="sr-ws-card sr-ws-location">
        <div class="sr-ws-location__head"><h3 class="sr-ws-h3 sr-ws-location__name">Opening hours</h3><span class="sr-ws-pill sr-ws-pill--blue">${wkend.length === 2 ? 'Open 7 days' : wkend.length ? 'Open weekends' : 'Weekdays only'}</span></div>
        ${hoursTable(x)}
        ${x.nearby[0] ? `<p class="sr-ws-small sr-ws-muted">Closest other Synergy clinic: ${esc(x.nearby[0].name)}, about ${x.nearby[0].km} km away.</p>` : ''}
      </article>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-svc-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">At this clinic</p><h2 class="sr-ws-h2" id="sr-ws-svc-h">WCB care you can book at ${esc(x.name)}</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--${services.length > 2 ? '3' : '2'} sr-ws-list-reset" role="list">
      ${services.map(([t, d, id, rule]) => `<li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">${t}</h3><p class="sr-ws-card__text">${d}</p><p class="sr-ws-card__foot sr-ws-small">${c(id, rule)}</p></li>`).join('\n')}
    </ul>
    <p class="sr-ws-small">${c('SYN-JANE', `Online booking types checked ${ctx.janeDate}.`)}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" aria-labelledby="sr-ws-first-h">
  <div class="sr-ws-container">
    <div class="sr-ws-split">
      <figure class="sr-ws-split__media">${ctx.photo(`${x.page_slug}_inside`, `Treatment area at Synergy Rehab ${esc(x.name)}`, 800, 600, false, x)}</figure>
      <div class="sr-ws-split__body">
        <p class="sr-ws-eyebrow">Your first visit here</p><h2 class="sr-ws-h2" id="sr-ws-first-h">Starting WCB physio at ${esc(x.name)}</h2>
        <ol class="sr-ws-numlist" role="list">
          <li>${c('WSBC-43', 'Report your injury to WorkSafeBC online or through Teleclaim')} ${c('WSBC-44', '(1.888.967.5377)')}.</li>
          <li>Book a <strong>WCB Physio Initial Session</strong> at ${esc(x.name)} online or call ${esc(x.phone)}.</li>
          <li>${c('WSBC-46', 'Bring your 8-digit claim number')} if you have it.</li>
        </ol>
        <p><strong>When you arrive:</strong> ${ctx.slot(x, 'check_in', 'Check-in steps at the front desk, which floor or suite, what to expect in the first 10 minutes')}</p>
        <p class="sr-ws-split__foot">New to WorkSafeBC claims? <a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#eligibility">How WCB physio works at each claim stage</a></p>
      </div>
    </div>
  </div>
</section>

${ctx.team(x)}

<section class="sr-ws-band sr-ws-band--white" id="faq" aria-labelledby="sr-ws-faq-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><p class="sr-ws-eyebrow">FAQ</p><h2 class="sr-ws-h2" id="sr-ws-faq-h">Questions about WCB physio at ${esc(x.name)}</h2></div>
    <div class="sr-ws-faq sr-ws-faq--center">
      ${faq.map(([q, a]) => `<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">${q}</summary><div class="sr-ws-faq__a"><p>${a}</p></div></details>`).join('\n')}
    </div>
    <p class="sr-ws-center"><a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#faq">Claims, referrals and costs: all WorkSafeBC questions</a></p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-near-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Nearby</p><h2 class="sr-ws-h2" id="sr-ws-near-h">Other Synergy clinics near ${esc(x.name)}</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">${nearbyCards}</ul>
    <p><a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#clinics">See all 19+ locations</a></p>
    <ol class="sr-ws-sources">${[SOURCES.benefits, SOURCES.report, SOURCES.manual].map((s) => `<li><a href="${s.url}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
    <p class="sr-ws-asof">${ctx.asof()}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-cta-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><h2 class="sr-ws-h2" id="sr-ws-cta-h">Hurt at work? Book at ${esc(x.name)}.</h2>
      <p class="sr-ws-lede">${esc(addressLine(x.address))}, ${esc(x.address.city)}. Call ${esc(x.phone)}.</p></div>
    <a class="sr-ws-bigpill sr-ws-hide-below-desktop" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'final', 'location')}>Book a WCB assessment</a>
    <div class="sr-ws-linkcols">
      <div><p class="sr-ws-linkcols__title">Synergy Rehabilitation</p><p class="sr-ws-small">19+ locations from Vancouver to Abbotsford. synergyrehab.ca</p></div>
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul><li><a href="${PILLAR_PATH}">WorkSafeBC physiotherapy</a></li><li><a href="${PILLAR_PATH}#eligibility">Claim stages</a></li><li><a href="${PILLAR_PATH}#faq">FAQ</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">This clinic</p><ul><li><a href="${tel}" ${ev('worksafe_phone_click', x.page_slug, 'final', 'location')}>${esc(x.phone)}</a></li><li><a href="${mapsUrl(x)}" ${ev('worksafe_directions_click', x.page_slug, 'final', 'location')}>Directions</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">WorkSafeBC</p><ul><li><a href="${SOURCES.report.url}">Report an injury</a></li><li><a href="tel:+18889675377">Teleclaim 1.888.967.5377</a></li></ul></div>
    </div>
  </div>
</section>

<div class="sr-ws-sticky" role="region" aria-label="Book or call Synergy Rehab ${esc(x.name)}">
  <a class="sr-ws-btn sr-ws-btn--primary" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'sticky', 'location')}>Book online</a>
  <a class="sr-ws-btn sr-ws-btn--secondary sr-ws-sticky__call" href="${tel}" aria-label="Call Synergy Rehab ${esc(x.name)}" ${ev('worksafe_phone_click', x.page_slug, 'sticky', 'location')}>${icon('phone')}</a>
</div>
<div class="sr-ws-sticky-spacer"></div>
</div>`;
}
