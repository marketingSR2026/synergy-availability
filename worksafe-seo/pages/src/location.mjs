// Location page: /worksafe-physiotherapy/<clinic-slug>/ . WorkSafe only.
// Machine data: data/worksafe-locations.json. Human-owned facts and gates: data/clinic-signoff.csv (joined by the build as x.signoff).
// Shared WorkSafeBC explanations live on the pillar; this page carries what is specific to the clinic and links back.
import { esc, icon, ev, SOURCES, PILLAR_PATH, groupHours, opensWeekends, hoursSummary, addressLine, mapsUrl } from './shared.mjs';

export function locationMeta(x) {
  // Spec 2 rules 2 and 3: the title uses the page's own area label (Surrey after the neighbourhood) when it fits in 60 characters.
  const inCity = x.name.includes(x.address.city);
  const t = (place) => `WCB & WorkSafeBC Physio in ${place} | Synergy Rehab`;
  const title = [x.area_label, inCity ? x.name : `${x.name}, ${x.address.city}`].map(t).find((s) => s.length <= 60) || t(x.name);
  // Meta: add the city after the street when the name does not contain it; the pending-claim hook (WSBC-11) wins if both do not fit.
  const base = (city) => `Hurt at work? Book a WCB physio assessment at Synergy Rehab ${x.name}, ${x.address.street}${city}. ${hoursSummary(x.hours)}.`;
  const city = inCity ? '' : `, ${x.address.city}`;
  const tail = ' Your claim can be pending.';
  const description = [base(city) + tail, base('') + tail, base(city)].find((d) => d.length <= 155) || base('');
  return {
    id: x.page_slug,
    path: `${PILLAR_PATH}${x.page_slug}/`,
    title,
    description,
    claims: description.endsWith(tail) ? ['WSBC-11'] : [],
    h1: `WorkSafeBC physiotherapy in ${x.area_label}`,
  };
}

function hoursTable(x) {
  return `<table class="sr-ws-hours"><caption class="sr-ws-sr-only">Opening hours at Synergy Rehab ${esc(x.name)}</caption><tbody>
    ${groupHours(x.hours).map((r) => `<tr><th scope="row">${r.label}</th><td>${r.text}</td></tr>`).join('')}</tbody></table>`;
}

// Local FAQ: only questions a worker cannot answer from the pillar or the clinic card.
export function locationFaq(x, ctx) {
  const c = ctx.claim;
  const qa = [];
  const nm = `Synergy Rehab ${esc(x.name)}`;
  qa.push([`Is there a WorkSafeBC physiotherapy clinic in ${esc(x.area_label)}?`,
    `${ctx.contractClaim(x, `Yes. ${nm}, at ${esc(addressLine(x.address))}, ${esc(x.address.city)}, is a WorkSafeBC-contracted physiotherapy clinic.`)} ${c('SYN-JANE', 'You can book a WCB Physio Initial Session online')} or call ${esc(x.phone)}.`]);
  qa.push([`Where do I park at ${nm}?`, ctx.slot(x, 'parking', 'Parking: where to park, cost, time limits, closest transit stop')]);
  qa.push([`Which languages do the physiotherapists at ${nm} speak?`, ctx.slot(x, 'languages', 'Languages spoken by the physiotherapists who see WCB claims here')]);
  if (ctx.service(x, 'massage')) {
    qa.push([`Can I get WCB massage therapy at ${nm}?`,
      `${ctx.serviceClaim(x, 'massage', `Yes. ${nm} offers massage therapy on WorkSafeBC claims.`)} ${c('WSBC-35', 'WorkSafeBC massage needs a doctor&#8217;s referral and an accepted claim.')}`]);
  }
  const alts = ctx.nearbyWcb(x).slice(0, 2);
  if (alts.length) {
    qa.push([`What if ${nm} has no time that works for me?`,
      `Try our nearest clinics: ${alts.map((n) => `${ctx.clinicAnchor(n.clinic, 'faq', 'location')} (about ${n.km} km)`).join(' and ')}. ${c('SYN-JANE', `Every clinic on our <a href="${PILLAR_PATH}#clinics">WorkSafeBC physiotherapy page</a> books WCB physio online.`)}`]);
  }
  return qa;
}

export function location(x, ctx) {
  const c = ctx.claim;
  const tel = `tel:${x.phone_e164}`;
  const book = ctx.bookUrl(x);
  const wkend = opensWeekends(x.hours);
  const services = [
    ['WCB physio assessment', 'Your first visit: we assess the injury and build a plan around your job.', c('WSBC-12', 'You can have it on a pending claim within 60 days of your injury.')],
    ['WCB physio treatment visits', 'Hands-on care and exercise at follow-up visits.', c('WSBC-17', 'Funded visits start once your claim is accepted.')],
  ];
  if (ctx.service(x, 'massage')) services.push(['WCB massage therapy', ctx.serviceClaim(x, 'massage', 'Massage therapy on a WorkSafeBC claim.'), c('WSBC-35', 'Needs a doctor&#8217;s referral and an accepted claim.')]);
  if (ctx.service(x, 'acupuncture')) services.push(['WCB acupuncture', ctx.serviceClaim(x, 'acupuncture', 'Acupuncture on a WorkSafeBC claim.'), c('WSBC-36', 'Needs an accepted claim.')]);
  const faq = locationFaq(x, ctx);
  const nearby = ctx.nearbyWcb(x);
  const closing = hoursSummary(x.hours).replace(/^Open .*? until /, 'until ');

  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${PILLAR_PATH}">WorkSafeBC physiotherapy</a></li><li><span aria-current="page">${esc(x.name)}</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">${ctx.contractClaim(x, 'WorkSafeBC-contracted clinic')}</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Synergy Rehab ${esc(x.name)}</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">WorkSafeBC physiotherapy in <span class="sr-ws-accent">${esc(x.area_label)}</span></h1>
        <p class="sr-ws-lede">Book a WCB physio assessment at ${esc(addressLine(x.address))}. ${c('WSBC-11', 'Your claim can still be pending.')}</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'hero', 'location')}>Book a WCB assessment<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="${tel}" ${ev('worksafe_phone_click', x.page_slug, 'hero', 'location')}>${icon('phone')}Call ${esc(x.phone)}</a>
        </div>
        <p class="sr-ws-small">Not reported yet? ${c('WSBC-43', 'Report it to WorkSafeBC online')} ${c('WSBC-44', 'or call Teleclaim at 1.888.967.5377')}.</p>
        <ul class="sr-ws-proof" role="list"><li>${hoursSummary(x.hours)}</li><li>${ctx.contractClaim(x, 'We bill WorkSafeBC on accepted claims', 'SYN-08')}</li><li>19+ locations</li></ul>
      </div>
      <figure class="sr-ws-hero__media">
        ${ctx.photo(x, 'hero', `Front entrance of Synergy Rehab ${esc(x.name)}`, 800, 1000, true)}
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">${icon('calendar')}</span><span><span class="sr-ws-minicard__value">Online</span><span class="sr-ws-minicard__label">WCB booking</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br"><span class="sr-ws-minicard__icon">${icon('clock')}</span><span><span class="sr-ws-minicard__value">${wkend.length === 2 ? '7 days' : 'Weekdays'}</span><span class="sr-ws-minicard__label">${closing}</span></span></li>
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
        <div class="sr-ws-location__head"><h3 class="sr-ws-h3 sr-ws-location__name">Synergy Rehab ${esc(x.name)}</h3></div>
        <address class="sr-ws-location__addr">${esc(addressLine(x.address))}<br>${esc(x.address.city)}, BC ${esc(x.address.postal)}</address>
        <dl class="sr-ws-location__meta">
          <div><dt>Phone</dt><dd><a class="sr-ws-location__phone" href="${tel}" ${ev('worksafe_phone_click', x.page_slug, 'card', 'location')}>${esc(x.phone)}</a></dd></div>
          <div><dt>Getting here</dt><dd>${ctx.slot(x, 'getting_here', 'Closest bus stop or SkyTrain station, landmarks, which building entrance and floor')}</dd></div>
          <div><dt>Accessibility</dt><dd>${ctx.slot(x, 'accessibility', 'Step-free entrance, elevator, accessible washroom, accessible parking')}</dd></div>
        </dl>
        <div class="sr-ws-location__actions">
          <a class="sr-ws-btn sr-ws-btn--primary" href="${book}" ${ev('worksafe_book_click', x.page_slug, 'card', 'location')}>Book WCB physio at ${esc(x.name)}</a>
          <a class="sr-ws-link sr-ws-link--ext" href="${mapsUrl(x)}" ${ev('worksafe_directions_click', x.page_slug, 'card', 'location')}>Get directions</a>
        </div>
      </article>
      <article class="sr-ws-card sr-ws-location">
        <div class="sr-ws-location__head"><h3 class="sr-ws-h3 sr-ws-location__name">Opening hours</h3><span class="sr-ws-pill sr-ws-pill--blue">${wkend.length === 2 ? 'Open 7 days' : wkend.length ? 'Open weekends' : 'Weekdays only'}</span></div>
        ${hoursTable(x)}
      </article>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-svc-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">At this clinic</p><h2 class="sr-ws-h2" id="sr-ws-svc-h">WCB care you can book at ${esc(x.name)}</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--${services.length > 2 ? '3' : '2'} sr-ws-list-reset" role="list">
      ${services.map(([t, d, rule]) => `<li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">${t}</h3><p class="sr-ws-card__text">${d}</p><p class="sr-ws-card__foot sr-ws-small">${rule}</p></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" aria-labelledby="sr-ws-first-h">
  <div class="sr-ws-container">
    <div class="sr-ws-split">
      <figure class="sr-ws-split__media">${ctx.photo(x, 'inside', `Treatment area at Synergy Rehab ${esc(x.name)}`, 800, 600, false)}</figure>
      <div class="sr-ws-split__body">
        <p class="sr-ws-eyebrow">Your first visit here</p><h2 class="sr-ws-h2" id="sr-ws-first-h">Starting WCB physio at ${esc(x.name)}</h2>
        <p><strong>When you arrive:</strong> ${ctx.slot(x, 'check_in', 'Check-in at the front desk, which floor or suite, forms to fill, what happens in the first 10 minutes')}</p>
        <ol class="sr-ws-numlist" role="list">
          <li>Book a <strong>WCB Physio Initial Session</strong> online, or call ${esc(x.phone)}.</li>
          <li>Tell us the date and how the injury happened at work, and your employer&#8217;s name.</li>
          <li>${c('WSBC-46', 'Bring your 8-digit WorkSafeBC claim number')} if it has arrived.</li>
        </ol>
        <p class="sr-ws-split__foot">How claims work at each stage: <a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#eligibility">WorkSafeBC physiotherapy</a></p>
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
    <p class="sr-ws-center"><a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#faq">More WorkSafeBC physiotherapy questions</a>${ctx.link('guide') ? `<br><a class="sr-ws-link sr-ws-link--arrow" href="${ctx.link('guide')}">Claims, pending claims and costs: the WorkSafeBC coverage guide</a>` : ''}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-near-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Nearby</p><h2 class="sr-ws-h2" id="sr-ws-near-h">${!nearby.length ? 'More Synergy Rehab clinics' : nearby[0].km > 15 ? `Next closest Synergy clinics to ${esc(x.name)}` : `Other Synergy clinics near ${esc(x.name)}`}</h2></div>
    ${nearby.length ? `<ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">${nearby.map((n) => ctx.clinicCard(n.clinic, `${esc(n.clinic.address.street)}<br>About ${n.km} km away`, 'nearby', 'location').replace(/<(\/?)h4\b/g, '<$1h3')).join('\n')}</ul>` : ''}
    <p><a class="sr-ws-link sr-ws-link--arrow" href="${PILLAR_PATH}#clinics">Find another clinic for WCB physio</a></p>
    <h3 class="sr-ws-h4">Sources</h3>
    <ol class="sr-ws-sources">${[SOURCES.benefits, SOURCES.report, SOURCES.manual, ...(ctx.service(x, 'massage') ? [SOURCES.massage] : [])].map((s) => `<li><a href="${s.url}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
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
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul><li><a href="${PILLAR_PATH}">WorkSafeBC physiotherapy</a></li><li><a href="${PILLAR_PATH}#eligibility">Claim stages</a></li>${ctx.link('guide') ? `<li><a href="${ctx.link('guide')}">Claims and costs guide</a></li>` : ''}${ctx.link('rtw') ? `<li><a href="${ctx.link('rtw')}">Return to work</a></li>` : ''}<li><a href="${PILLAR_PATH}#faq">WorkSafeBC questions</a></li></ul></div>
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
