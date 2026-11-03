// Pillar: /worksafe-physiotherapy/ . WorkSafe only. Owner of the head terms and of multi-clinic city queries (Surrey).
// Every WorkSafeBC fact is wrapped in ctx.claim(id, html). Clinics appear with WCB wording only when ctx.wcbOk(clinic) (gate G1).
import { esc, icon, ev, SOURCES, PILLAR_PATH, AREAS, addressLine } from './shared.mjs';

export const pillarMeta = {
  id: 'pillar',
  path: PILLAR_PATH,
  title: 'WorkSafeBC & WCB Physiotherapy in BC | Synergy Rehab',
  description: 'Hurt at work in BC? See how WorkSafeBC (WCB) physiotherapy works at each claim stage, what you may pay, and book an assessment at a Synergy Rehab clinic.',
  h1: 'WorkSafeBC (WCB) physiotherapy for work injuries',
};

const areaId = (a) => `area-${a.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-+$/, '')}`;

export function pillarFaq(ctx) {
  const c = ctx.claim;
  return [
    ['Is WCB the same as WorkSafeBC?',
      `${c('GEN-01', 'Yes. WorkSafeBC is the Workers&#8217; Compensation Board of British Columbia, which is why many people still call it WCB. You may also see it written as WSBC.')}`],
    ['Do I need a claim number before I book?',
      `No. ${c('WSBC-11', 'At a WorkSafeBC-contracted physiotherapist you can have your initial assessment before WorkSafeBC accepts your claim,')} ${c('WSBC-12', 'if it is within 60 days of your injury.')} ${c('WSBC-13', 'You do need to report the injury to WorkSafeBC so there is a claim, even if it is still pending.')} ${c('WSBC-46', 'WorkSafeBC mails you an 8-digit claim number once it gets your report.')}`],
    ['Do I need a doctor&#8217;s referral for WorkSafeBC physio?',
      `${c('WSBC-10', 'WorkSafeBC tells workers who need physiotherapy to visit a contracted physiotherapist and explain that the injury is work-related.')} ${c('WSBC-16', 'Its guidance for physiotherapy does not list a doctor&#8217;s referral as a step.')} ${c('WSBC-14', 'If treatment starts more than 60 days after your injury, WorkSafeBC has to approve it first.')} ${c('WSBC-35', 'Massage therapy is different: it needs a doctor&#8217;s referral and an accepted claim.')}`],
    ['Will WCB pay for my physio, or will I have to pay?',
      `${c('WSBC-23', 'Once your claim is accepted, yes. Your provider bills WorkSafeBC for care related to your claim, and you should not have to pay fees.')} ${c('WSBC-28', 'While your claim is pending, a clinic may ask you to pay for treatment, and you can ask for a refund if the claim is accepted later.')} ${c('SYN-PEND', 'Ask the clinic how it handles visits while your claim is pending.')} ${c('WSBC-25', 'Treatment for a body area that is not part of your accepted claim can be billed to you.')}`],
    ['What happens if my claim is denied?',
      `${c('WSBC-29', 'If your claim was pending at your first visit, WorkSafeBC still pays the contracted clinic for that initial assessment, even if the claim is later denied.')} ${c('WSBC-30', 'WorkSafeBC does not pay for treatment visits given while the claim was pending if it is denied.')}`],
    ['It has been more than 60 days since my injury. Can I still get physio?',
      `${c('WSBC-14', 'Yes, but WorkSafeBC has to approve treatment first when it starts more than 60 days after the injury. It is not refused automatically.')}`],
    ['How many physio visits does WorkSafeBC cover?',
      `${c('WSBC-17', 'Treatment visits paid by WorkSafeBC start once your claim is accepted.')} ${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides.')} ${c('WSBC-01', 'WorkSafeBC&#8217;s new physiotherapy services agreement took effect on April 1, 2026.')} If another page gives you a visit number, check it against WorkSafeBC&#8217;s own site, and ask your physiotherapist where your treatment stands on your claim.`],
    ['What if I go to a physio who is not contracted with WorkSafeBC?',
      `${c('WSBC-26', 'You pay for each visit yourself and ask WorkSafeBC to reimburse you at its set rate, which is $95 per visit from April 1, 2026. You pay any difference.')}`],
    ['How do I report a workplace injury to WorkSafeBC?',
      `${c('WSBC-42', 'Tell your employer as soon as it is safe, and tell anyone who treats you that it happened at work.')} ${c('WSBC-43', 'Then report it to WorkSafeBC online at any time, or by phone through Teleclaim.')} ${c('WSBC-44', 'Teleclaim is 1.888.967.5377 toll-free or 604.231.8888 in the Lower Mainland, Monday to Friday, 8 a.m. to 6 p.m.')} ${c('WSBC-45', 'You have up to one year to report, but report right away.')}`],
  ];
}

function finder(ctx) {
  const bySlug = ctx.bySlug;
  return AREAS.map(([area, slugs]) => {
    const list = slugs.map((s) => bySlug[s]).filter((x) => x && ctx.listInFinder(x));
    if (!list.length) return '';
    const heading = area === 'Surrey' ? 'WorkSafeBC physiotherapy in Surrey' : esc(area);
    return `<div class="sr-ws-finder-group" id="${areaId(area)}">
      <h3 class="sr-ws-h3">${heading} <span class="sr-ws-muted sr-ws-small">${list.length} ${list.length === 1 ? 'clinic' : 'clinics'}</span></h3>
      <ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">${list.map((x) => ctx.clinicCard(x, `${esc(x.area_label)}<br>${esc(addressLine(x.address))}<br>${esc(x.phone)}`, 'finder', 'pillar')).join('\n')}</ul>
    </div>`;
  }).join('\n');
}

export function pillar(ctx) {
  const c = ctx.claim;
  const faq = pillarFaq(ctx);
  const n = ctx.clinics.filter((x) => ctx.listInFinder(x)).length;
  const massage = ctx.clinics.filter((x) => ctx.service(x, 'massage'));
  const acu = ctx.clinics.filter((x) => ctx.service(x, 'acupuncture'));
  const rtw = ctx.link('rtw'); const guide = ctx.link('guide');
  const chips = AREAS.filter(([, s]) => s.some((k) => ctx.bySlug[k] && ctx.listInFinder(ctx.bySlug[k]))).map(([a]) => `<li><a class="sr-ws-chip" href="#${areaId(a)}">${esc(a)}</a></li>`).join('');
  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">WorkSafeBC physiotherapy</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">WCB booking online</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Hurt at work in BC?</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">WorkSafeBC (WCB) physiotherapy for <span class="sr-ws-accent">work injuries</span></h1>
        <p class="sr-ws-lede">${c('WSBC-12', 'Within 60 days of your injury,')} ${c('WSBC-11', 'you can start WCB physiotherapy with an assessment before your claim is accepted.')} ${c('SYN-JANE', 'Book online.')}</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="#clinics" ${ev('worksafe_location_select', 'all', 'hero', 'pillar')}>Find your clinic<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="#steps">How it works</a>
        </div>
        <ul class="sr-ws-chips" role="list" aria-label="Jump to clinics by area">${chips}</ul>
      </div>
      <figure class="sr-ws-hero__media">
        ${ctx.pillarPhoto('pillar_hero', 'Physiotherapist assessing a patient&#8217;s shoulder at a Synergy Rehab clinic', 800, 1000, true)}
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">${icon('pin')}</span><span><span class="sr-ws-minicard__value">19+</span><span class="sr-ws-minicard__label">locations</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br"><span class="sr-ws-minicard__icon">${icon('calendar')}</span><span><span class="sr-ws-minicard__value">Evenings</span><span class="sr-ws-minicard__label">and weekends at most clinics</span></span></li>
        </ul>
      </figure>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" id="steps" aria-labelledby="sr-ws-steps-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">How it works</p><h2 class="sr-ws-h2" id="sr-ws-steps-h">Injured at work in BC? Three steps to WCB physiotherapy</h2>
      <p class="sr-ws-lede">${c('WSBC-11', 'You can book before your claim number arrives.')}</p></div>
    <ol class="sr-ws-steps sr-ws-steps--h" role="list" style="--sr-ws-steps:3">
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">Right away</span>
        <h3 class="sr-ws-step__title">Report the injury</h3>
        <p class="sr-ws-step__body">${c('WSBC-42', 'Tell your employer as soon as it is safe.')} ${c('WSBC-43', 'Report to WorkSafeBC online any time, or call Teleclaim')} ${c('WSBC-44', 'at 1.888.967.5377 (604.231.8888 in the Lower Mainland), weekdays 8 a.m. to 6 p.m.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">Next</span>
        <h3 class="sr-ws-step__title">Book your assessment</h3>
        <p class="sr-ws-step__body">Pick the clinic nearest home or work and book a <strong>WCB Physio Initial Session</strong>. ${c('WSBC-10', 'Tell us the injury happened at work.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">At your visit</span>
        <h3 class="sr-ws-step__title">Bring your claim number</h3>
        <p class="sr-ws-step__body">${c('WSBC-46', 'WorkSafeBC mails an 8-digit claim number.')} Bring it if it has arrived. ${c('WSBC-11', 'Contracted physiotherapists bill WorkSafeBC directly for the assessment.')}</p></li>
    </ol>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="clinics" aria-labelledby="sr-ws-clinics-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Find your clinic</p><h2 class="sr-ws-h2" id="sr-ws-clinics-h">Find WCB physiotherapy near you</h2>
      <p class="sr-ws-lede">${c('SYN-JANE', 'Every clinic below books WCB physiotherapy assessments online.')} Pick the one nearest home or work.</p></div>
    ${finder(ctx)}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--dotted" id="eligibility"><div class="sr-ws-container">
  <article class="sr-ws-card sr-ws-elig" aria-labelledby="sr-ws-elig-h">
    <div class="sr-ws-elig__head"><span class="sr-ws-icon-well">${icon('shield')}</span>
      <div><p class="sr-ws-eyebrow">Before you book</p><h2 class="sr-ws-h2" id="sr-ws-elig-h">How WCB physio works at each claim stage</h2></div></div>
    <div class="sr-ws-callout"><span class="sr-ws-label">Who this is for</span><p>${c('WSBC-13', 'Workers in BC who were hurt at work and have reported the injury to WorkSafeBC, or are reporting it now. The claim can still be pending.')}</p></div>
    <ol class="sr-ws-numlist" role="list">
      <li><strong>Claim accepted.</strong> ${c('WSBC-23', 'Care related to your claim is billed to WorkSafeBC and you should not have to pay fees.')}</li>
      <li><strong>Claim pending.</strong> ${c('WSBC-12', 'Your first assessment can go ahead without prior approval within 60 days of your injury.')} ${c('WSBC-29', 'WorkSafeBC pays for that assessment even if the claim is later denied.')} ${c('WSBC-17', 'Funded treatment visits start once the claim is accepted.')} ${c('WSBC-28', 'Until then, a clinic may ask you to pay for treatment.')}</li>
      <li><strong>More than 60 days since the injury.</strong> ${c('WSBC-14', 'WorkSafeBC must approve treatment before it starts. It is not refused automatically.')}</li>
    </ol>
    <div class="sr-ws-box"><p class="sr-ws-box__head">For your first visit <span class="sr-ws-pill sr-ws-pill--blue">Checklist</span></p>
      <div class="sr-ws-box__body"><ul class="sr-ws-checklist" role="list">
        <li>${c('WSBC-46', 'Your 8-digit claim number, if it has arrived')}</li>
        <li>Your employer&#8217;s name</li>
        <li>The date and how the injury happened</li>
        <li>Clothes you can move in</li>
      </ul></div></div>
    <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>Booking online? Choose <strong>WCB Physio Initial Session</strong> so your first visit is set up as a WorkSafeBC claim.</span></p>
    <div class="sr-ws-actions">
      <a class="sr-ws-btn sr-ws-btn--secondary sr-ws-btn--sm" href="${SOURCES.report.url}">Reporting? What WorkSafeBC asks for &#8599;</a>
      <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--sm" href="#clinics">Find your clinic &#8594;</a>
    </div>
    <p class="sr-ws-asof">${ctx.asof()}</p>
  </article>
</div></section>

<section class="sr-ws-band sr-ws-band--white" aria-labelledby="sr-ws-cond-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Common work injuries</p><h2 class="sr-ws-h2" id="sr-ws-cond-h">Work injuries our physiotherapists treat</h2>
      <p class="sr-ws-lede">Your plan is built around what your job asks of your body, whether that is lifting on a site, driving, patient care or desk work.</p></div>
    <ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">
      ${[
        ['back', 'Back strain from lifting', 'Pain or stiffness after lifting, carrying, bending or twisting at work.'],
        ['shoulder', 'Shoulder strain and overuse', 'Pain reaching overhead, pushing, pulling or carrying loads on one side.'],
        ['hand', 'Repetitive strain', 'Wrist, elbow or forearm pain from repeated tasks, tools or keyboard work.'],
        ['neck', 'Neck strain', 'Neck pain and stiffness after a strain, a long shift at a screen or a sudden movement.'],
        ['fall', 'Slips, trips and falls', 'Sprains, strains and bruising after a fall on stairs, ladders, ice or wet floors.'],
        ['knee', 'Knee and ankle injuries', 'Twists and sprains from climbing, kneeling, uneven ground or stepping down.'],
      ].map(([i, t, d]) => `<li class="sr-ws-card sr-ws-card--soft sr-ws-notch sr-ws-condition">
          <span class="sr-ws-notch__tab"><span class="sr-ws-icon-badge">${icon(i)}</span></span>
          <h3 class="sr-ws-h3 sr-ws-card__title">${t}</h3><p class="sr-ws-card__text">${d}</p></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-first-h">
  <div class="sr-ws-container">
    <div class="sr-ws-split">
      <figure class="sr-ws-split__media">${ctx.pillarPhoto('pillar_first_visit', 'Treatment room at a Synergy Rehab clinic', 800, 600)}</figure>
      <div class="sr-ws-split__body">
        <p class="sr-ws-eyebrow">Your first visit</p><h2 class="sr-ws-h2" id="sr-ws-first-h">What happens at your WCB physio assessment</h2>
        <ul class="sr-ws-checklist" role="list">
          <li>We ask how and when you were hurt at work, and what your job involves.</li>
          <li>Your physiotherapist checks how you move, your strength and where it hurts.</li>
          <li>You get a plan with goals tied to the tasks you need to get back to.</li>
          <li>You leave with things you can do at home and at work while you recover.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-rtw-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Return to work</p><h2 class="sr-ws-h2" id="sr-ws-rtw-h">Back to work, one step at a time</h2></div>
    <ol class="sr-ws-phases" role="list">
      <li class="sr-ws-card sr-ws-phase"><span class="sr-ws-pill sr-ws-pill--blue">Phase 1</span><h3 class="sr-ws-h3 sr-ws-card__title">Assess</h3><p class="sr-ws-card__text">We look at your injury and the physical demands of your job.</p></li>
      <li class="sr-ws-card sr-ws-phase"><span class="sr-ws-pill sr-ws-pill--blue">Phase 2</span><h3 class="sr-ws-h3 sr-ws-card__title">Treat</h3><p class="sr-ws-card__text">Hands-on care and exercise to settle pain and restore movement.</p></li>
      <li class="sr-ws-card sr-ws-phase"><span class="sr-ws-pill sr-ws-pill--blue">Phase 3</span><h3 class="sr-ws-h3 sr-ws-card__title">Build</h3><p class="sr-ws-card__text">Graded exercise that works up to the lifting, standing or reaching your job needs.</p></li>
      <li class="sr-ws-card sr-ws-phase"><span class="sr-ws-pill sr-ws-pill--blue">Phase 4</span><h3 class="sr-ws-h3 sr-ws-card__title">Return</h3><p class="sr-ws-card__text">Back to work, sometimes on modified duties first, with a plan for the rest.</p></li>
    </ol>
    <div class="sr-ws-note"><p>${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it. WorkSafeBC decides.')}${rtw ? ` Read more: <a class="sr-ws-link sr-ws-link--arrow" href="${rtw}">Gradual return to work and modified duties</a>` : ''}</p></div>
  </div>
</section>

${massage.length || acu.length ? `<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-more-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">More WorkSafeBC care</p><h2 class="sr-ws-h2" id="sr-ws-more-h">Massage therapy and acupuncture on a WCB claim</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      ${massage.length ? `<li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB massage therapy</h3>
        <p class="sr-ws-card__text">${c('WSBC-35', 'WorkSafeBC massage therapy needs a doctor&#8217;s referral and an accepted claim. More treatment after the first set needs WorkSafeBC approval.')}</p>
        <p class="sr-ws-card__text">Offered at ${massage.map((x) => ctx.serviceClaim(x, 'massage', esc(x.name))).join(', ')}.</p></li>` : ''}
      ${acu.length ? `<li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB acupuncture</h3>
        <p class="sr-ws-card__text">${c('WSBC-36', 'WorkSafeBC acupuncture needs an accepted claim.')} Offered at ${acu.map((x) => ctx.serviceClaim(x, 'acupuncture', esc(x.name))).join(', ')}.</p></li>` : ''}
    </ul>
  </div>
</section>` : ''}

<section class="sr-ws-band sr-ws-band--white" id="faq" aria-labelledby="sr-ws-faq-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><p class="sr-ws-eyebrow">FAQ</p><h2 class="sr-ws-h2" id="sr-ws-faq-h">WorkSafeBC physio questions</h2></div>
    <div class="sr-ws-faq sr-ws-faq--center">
      ${faq.map(([q, a]) => `<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">${q}</summary><div class="sr-ws-faq__a"><p>${a}</p></div></details>`).join('\n')}
    </div>
    ${guide ? `<p class="sr-ws-center"><a class="sr-ws-link sr-ws-link--arrow" href="${guide}">Claims, costs and coverage in detail</a></p>` : ''}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--tight" aria-labelledby="sr-ws-src-h">
  <div class="sr-ws-container">
    <h2 class="sr-ws-h4" id="sr-ws-src-h">Sources</h2>
    <ol class="sr-ws-sources">${[SOURCES.benefits, SOURCES.report, SOURCES.manual, SOURCES.massage].map((s) => `<li><a href="${s.url}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
    <p class="sr-ws-asof">${ctx.asof()}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-cta-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><h2 class="sr-ws-h2" id="sr-ws-cta-h">Hurt at work? Start with an assessment.</h2>
      <p class="sr-ws-lede">Book online at the clinic nearest you. Evening and weekend times at most clinics.</p></div>
    <a class="sr-ws-bigpill sr-ws-hide-below-desktop" href="#clinics" ${ev('worksafe_location_select', 'all', 'final', 'pillar')}>Find your clinic</a>
    <div class="sr-ws-linkcols">
      <div><p class="sr-ws-linkcols__title">Synergy Rehabilitation</p><p class="sr-ws-small">19+ locations from Vancouver to Abbotsford. synergyrehab.ca</p></div>
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul>${guide ? `<li><a href="${guide}">What WorkSafeBC covers</a></li>` : ''}${rtw ? `<li><a href="${rtw}">Return to work</a></li>` : ''}<li><a href="#faq">FAQ</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">Clinics</p><ul>${AREAS.map(([a]) => `<li><a href="#${areaId(a)}">${esc(a)}</a></li>`).join('')}</ul></div>
      <div><p class="sr-ws-linkcols__title">WorkSafeBC</p><ul><li><a href="${SOURCES.report.url}">Report an injury</a></li><li><a href="tel:+18889675377">Teleclaim 1.888.967.5377</a></li></ul></div>
    </div>
  </div>
</section>

<div class="sr-ws-sticky" role="region" aria-label="Find a WorkSafe clinic">
  <a class="sr-ws-btn sr-ws-btn--primary" href="#clinics" ${ev('worksafe_location_select', 'all', 'sticky', 'pillar')}>Find your clinic</a>
</div>
<div class="sr-ws-sticky-spacer"></div>
</div>`;
}
