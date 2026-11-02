// Pillar: /worksafe-physiotherapy/ . WorkSafe only. Every WorkSafeBC fact is wrapped in ctx.claim(id, html).
import { esc, icon, ev, SOURCES, PILLAR_PATH, GUIDE_PATH, RTW_PATH, AREAS, addressLine } from './shared.mjs';

export const pillarMeta = {
  id: 'pillar',
  path: PILLAR_PATH,
  title: 'WorkSafeBC Physiotherapy (WCB) at 19+ Clinics | Synergy Rehab',
  description: 'Hurt at work in BC? Book a WCB physiotherapy assessment at one of 19+ Synergy Rehab clinics from Vancouver to Abbotsford. How claims, visits and costs work.',
  h1: 'WorkSafeBC physiotherapy for work injuries',
};

export function pillarFaq(ctx) {
  const c = ctx.claim;
  return [
    ['Is WCB the same as WorkSafeBC?',
      `${c('GEN-01', 'Yes. WorkSafeBC is the Workers&#8217; Compensation Board of British Columbia, which is why many people still call it WCB.')} You will see both names on our booking pages.`],
    ['Do I need a claim number before I book?',
      `No. ${c('WSBC-11', 'At a WorkSafeBC-contracted physiotherapist you can have your initial assessment before WorkSafeBC accepts your claim.')} ${c('WSBC-13', 'You do need to report the injury to WorkSafeBC so there is a claim to bill, even if it is still pending.')} ${c('WSBC-46', 'WorkSafeBC mails you an 8-digit claim number once it gets your report.')} Bring it to a later visit if you do not have it yet.`],
    ['Do I need a doctor&#8217;s referral for WorkSafeBC physio?',
      `${c('WSBC-16', 'No. WorkSafeBC&#8217;s guidance for workers is to visit a contracted physiotherapist and explain that the injury is work-related. A doctor&#8217;s referral is not one of the steps.')} ${c('WSBC-35', 'Massage therapy is different: it needs a doctor&#8217;s referral and an accepted claim.')}`],
    ['Will I have to pay anything?',
      `${c('WSBC-23', 'Once WorkSafeBC accepts your claim, your provider bills WorkSafeBC for care related to your claim and you should not have to pay any fees.')} ${c('WSBC-28', 'If you have treatment before your claim is accepted, a clinic may ask you to pay, and you can ask for a refund if the claim is accepted later.')} ${c('SYN-PEND', 'Ask the clinic how it handles visits while your claim is pending before you book follow-up visits.')}`],
    ['What happens if my claim is denied?',
      `${c('WSBC-29', 'If your claim was pending at your first visit, WorkSafeBC still pays the contracted clinic for that initial assessment, even if the claim is later denied.')} ${c('WSBC-30', 'WorkSafeBC does not pay for treatment visits given while the claim was pending if it is denied.')}`],
    ['It has been more than 60 days since my injury. Can I still get physio?',
      `${c('WSBC-14', 'Yes, but WorkSafeBC has to approve treatment first when it starts more than 60 days after the injury. It is not refused automatically.')} Call the clinic and we will tell you what we need to ask WorkSafeBC.`],
    ['How many physio visits does WorkSafeBC cover?',
      `WorkSafeBC sets the length of each treatment period for your claim. ${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides.')} ${c('SYN-05', 'We explain what is approved for your claim at each stage.')}`],
    ['What if I go to a physio who is not contracted with WorkSafeBC?',
      `${c('WSBC-26', 'You pay for each visit yourself and ask WorkSafeBC to reimburse you at its set rate, which is $95 per visit from April 1, 2026. You pay any difference.')}`],
    ['Can I get massage therapy on my WorkSafeBC claim?',
      `${c('WSBC-35', 'Yes, with a doctor&#8217;s referral and an accepted claim. WorkSafeBC covers an assessment and up to 6 massage treatments in the first 8 weeks after the injury without pre-approval. More needs approval.')} See the clinic list below for clinics that book WCB massage online.`],
    ['How do I report a workplace injury to WorkSafeBC?',
      `${c('WSBC-42', 'Tell your employer as soon as it is safe, and tell anyone who treats you that it happened at work.')} ${c('WSBC-43', 'Then report it to WorkSafeBC online at any time, or by phone through Teleclaim.')} ${c('WSBC-44', 'Teleclaim is 1.888.967.5377 toll-free or 604.231.8888 in the Lower Mainland, Monday to Friday, 8 a.m. to 6 p.m.')} ${c('WSBC-45', 'You have up to one year to report, but report right away.')}`],
  ];
}

const quick = (q, a) => `<li class="sr-ws-card sr-ws-card--soft"><h3 class="sr-ws-h4 sr-ws-card__title">${q}</h3><p class="sr-ws-card__text">${a}</p></li>`;

function finder(ctx) {
  const bySlug = Object.fromEntries(ctx.clinics.map((x) => [x.page_slug, x]));
  return AREAS.map(([area, slugs]) => {
    const cards = slugs.map((s) => bySlug[s]).filter(Boolean).map((x) => {
      const own = ctx.linked(x.page_slug);
      const href = own ? ctx.href(x) : x.jane.wcb_initial_url;
      const cta = own ? `WorkSafe physio at ${esc(x.name)}` : `Book WCB physio at ${esc(x.name)}`;
      const evt = own ? ev('worksafe_location_select', x.page_slug, 'finder', 'pillar') : ev('worksafe_book_click', x.page_slug, 'finder', 'pillar');
      return `<li class="sr-ws-card sr-ws-card--soft sr-ws-card--interactive sr-ws-loccard">
          <h4 class="sr-ws-h4 sr-ws-card__title"><a class="sr-ws-card__link" href="${esc(href)}" ${evt}>Synergy Rehab ${esc(x.name)}</a></h4>
          <p class="sr-ws-loccard__area">${esc(x.area_label)}<br>${esc(addressLine(x.address))}<br>${esc(x.phone)}</p>
          <span class="sr-ws-loccard__cta">${cta}</span>
        </li>`;
    }).join('\n');
    const n = slugs.length;
    return `<div class="sr-ws-finder-group">
      <h3 class="sr-ws-h3">${esc(area)} <span class="sr-ws-muted sr-ws-small">${n} ${n === 1 ? 'clinic' : 'clinics'}</span></h3>
      <ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">${cards}</ul>
    </div>`;
  }).join('\n');
}

export function pillar(ctx) {
  const c = ctx.claim;
  const massage = ctx.clinics.filter((x) => x.wcb_massage_bookable).map((x) => esc(x.name));
  const acu = ctx.clinics.filter((x) => x.wcb_acupuncture_bookable).map((x) => esc(x.name));
  const faq = pillarFaq(ctx);
  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">WorkSafeBC physiotherapy</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">WCB booking online</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Hurt at work in BC?</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">WorkSafeBC physiotherapy for <span class="sr-ws-accent">work injuries</span></h1>
        <p class="sr-ws-lede">${c('WSBC-10', 'WorkSafeBC asks injured workers to see a contracted physiotherapist and say the injury is work-related.')} Book a WCB physio assessment online at any of our 19+ locations from Vancouver to Abbotsford.</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="#clinics" ${ev('worksafe_location_select', 'all', 'hero', 'pillar')}>Find your clinic<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="#steps">How WCB physio works</a>
        </div>
        <ul class="sr-ws-proof" role="list"><li>${c('SYN-JANE', 'WCB physio booking online at every clinic')}</li><li>Evening and weekend hours at most clinics</li><li>19+ locations</li></ul>
      </div>
      <figure class="sr-ws-hero__media">
        ${ctx.photo('pillar_hero', 'Inside a Synergy Rehab clinic: physiotherapist assessing a patient&#8217;s shoulder', 800, 1000, true)}
        <ul class="sr-ws-hero__floats" role="list">
          <li class="sr-ws-minicard sr-ws-minicard--tl"><span class="sr-ws-minicard__icon">${icon('pin')}</span><span><span class="sr-ws-minicard__value">19+</span><span class="sr-ws-minicard__label">locations</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--br"><span class="sr-ws-minicard__icon">${icon('calendar')}</span><span><span class="sr-ws-minicard__value">7 days</span><span class="sr-ws-minicard__label">at most clinics</span></span></li>
          <li class="sr-ws-minicard sr-ws-minicard--bl sr-ws-only-sm"><span class="sr-ws-minicard__icon">${icon('clock')}</span><span><span class="sr-ws-minicard__value">Evenings</span><span class="sr-ws-minicard__label">weekdays</span></span></li>
        </ul>
      </figure>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white sr-ws-band--flush-top" aria-labelledby="sr-ws-quick-h">
  <div class="sr-ws-container">
    <ul class="sr-ws-jumpnav" aria-label="On this page"><li><a href="#steps">How it works</a></li><li><a href="#eligibility">Is this for you?</a></li><li><a href="#clinics">Clinics</a></li><li><a href="#faq">FAQ</a></li></ul>
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Quick answers</p><h2 class="sr-ws-h2" id="sr-ws-quick-h">What injured workers ask us first</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      ${quick('Can I start before my claim is accepted?', `${c('WSBC-12', 'Yes, for the first visit. A contracted physiotherapist can do your initial assessment on a pending claim, without prior approval, if it is within 60 days of your injury.')}`)}
      ${quick('Will I pay anything?', `${c('WSBC-23', 'Once WorkSafeBC accepts your claim, care related to your claim is billed to WorkSafeBC and you should not have to pay fees.')}`)}
      ${quick('Do I need a doctor&#8217;s referral?', `${c('WSBC-16', 'Not for physiotherapy. WorkSafeBC tells workers to go to a contracted physiotherapist and say the injury is work-related.')}`)}
      ${quick('Is WCB the same as WorkSafeBC?', `${c('GEN-01', 'Yes. WorkSafeBC is the Workers&#8217; Compensation Board of BC, so many people call it WCB.')}`)}
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" id="steps" aria-labelledby="sr-ws-steps-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">How it works</p><h2 class="sr-ws-h2" id="sr-ws-steps-h">Three steps to WCB physio. <span class="sr-ws-accent">That&#8217;s it.</span></h2>
      <p class="sr-ws-lede">You can book before you have a claim number.</p></div>
    <ol class="sr-ws-steps sr-ws-steps--h" role="list" style="--sr-ws-steps:3">
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">Right away</span>
        <h3 class="sr-ws-step__title">Report the injury</h3>
        <p class="sr-ws-step__body">${c('WSBC-42', 'Tell your employer as soon as it is safe.')} ${c('WSBC-43', 'Report to WorkSafeBC online any time, or call Teleclaim')} ${c('WSBC-44', 'at 1.888.967.5377 (604.231.8888 in the Lower Mainland), weekdays 8 a.m. to 6 p.m.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">Next</span>
        <h3 class="sr-ws-step__title">Book your assessment</h3>
        <p class="sr-ws-step__body">Pick the clinic nearest home or work and book a <strong>WCB Physio Initial Session</strong> online. ${c('WSBC-10', 'Tell us the injury happened at work.')}</p></li>
      <li class="sr-ws-step"><span class="sr-ws-pill sr-ws-pill--on-blue sr-ws-step__when">At your visit</span>
        <h3 class="sr-ws-step__title">Bring your claim number</h3>
        <p class="sr-ws-step__body">${c('WSBC-46', 'WorkSafeBC mails an 8-digit claim number.')} Bring it if you have it. ${c('SYN-08', 'We bill WorkSafeBC for your care.')}</p></li>
    </ol>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--dotted" id="eligibility"><div class="sr-ws-container">
  <article class="sr-ws-card sr-ws-elig" aria-labelledby="sr-ws-elig-h">
    <div class="sr-ws-elig__head"><span class="sr-ws-icon-well">${icon('shield')}</span>
      <div><p class="sr-ws-eyebrow">Before you book</p><h2 class="sr-ws-h2" id="sr-ws-elig-h">Is WCB physio for you?</h2><p>It depends on where your claim is. Here is how each stage works.</p></div></div>
    <div class="sr-ws-callout"><span class="sr-ws-label">Who this is for</span><p>${c('WSBC-13', 'Workers in BC who were hurt at work and have reported the injury to WorkSafeBC, or are reporting it now. The claim can still be pending.')}</p></div>
    <h3 class="sr-ws-h4">Where is your claim?</h3>
    <ol class="sr-ws-numlist" role="list">
      <li><strong>Accepted.</strong> ${c('WSBC-23', 'Care related to your claim is billed to WorkSafeBC and you should not have to pay fees.')}</li>
      <li><strong>Pending.</strong> ${c('WSBC-12', 'Your first assessment can go ahead without prior approval within 60 days of your injury.')} ${c('WSBC-29', 'WorkSafeBC pays for that assessment even if the claim is later denied.')} ${c('WSBC-17', 'Funded treatment visits start once the claim is accepted.')}</li>
      <li><strong>More than 60 days since the injury.</strong> ${c('WSBC-14', 'WorkSafeBC must approve treatment before it starts. It is not refused automatically.')}</li>
    </ol>
    <div class="sr-ws-box"><p class="sr-ws-box__head">Have these ready <span class="sr-ws-pill sr-ws-pill--blue">Checklist</span></p>
      <div class="sr-ws-box__body"><ul class="sr-ws-checklist" role="list">
        <li>${c('WSBC-46', 'Your 8-digit claim number, if it has arrived')}</li>
        <li>${c('WSBC-49', 'Your employer&#8217;s name and contact details')}</li>
        <li>${c('WSBC-49', 'When and how the injury happened')}</li>
        <li>${c('WSBC-49', 'Your Personal Health Number')}</li>
      </ul></div></div>
    <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>Booking online? Choose <strong>WCB Physio Initial Session</strong> so your first visit is set up as a WorkSafeBC claim.</span></p>
    <div class="sr-ws-actions">
      <a class="sr-ws-btn sr-ws-btn--secondary sr-ws-btn--sm" href="${SOURCES.report.url}">WorkSafeBC: report an injury &#8599;</a>
      <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--sm" href="#clinics">Next: find your clinic &#8594;</a>
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
        ['knee', 'Knee and ankle injuries', 'Twists and sprains from climbing, kneeling, uneven ground or jumping down.'],
      ].map(([i, t, d]) => `<li class="sr-ws-card sr-ws-card--soft sr-ws-notch sr-ws-condition">
          <span class="sr-ws-notch__tab"><span class="sr-ws-icon-badge">${icon(i)}</span></span>
          <h3 class="sr-ws-h3 sr-ws-card__title">${t}</h3><p class="sr-ws-card__text">${d}</p></li>`).join('\n')}
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-first-h">
  <div class="sr-ws-container">
    <div class="sr-ws-split">
      <figure class="sr-ws-split__media">${ctx.photo('pillar_first_visit', 'Treatment room at a Synergy Rehab clinic', 800, 600)}</figure>
      <div class="sr-ws-split__body">
        <p class="sr-ws-eyebrow">Your first visit</p><h2 class="sr-ws-h2" id="sr-ws-first-h">What happens at your WCB physio assessment</h2>
        <ul class="sr-ws-checklist" role="list">
          <li>We ask how and when you were hurt at work, and what your job involves.</li>
          <li>Your physiotherapist checks how you move, your strength and where it hurts.</li>
          <li>You get a plan with goals tied to the tasks you need to get back to.</li>
          <li>You leave with things you can do at home and at work while you recover.</li>
        </ul>
        <p class="sr-ws-split__foot">Bring your claim number if you have it, and wear clothes you can move in.</p>
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
    <div class="sr-ws-note"><p>${c('WSBC-21', 'If you need more treatment, your physiotherapist can ask WorkSafeBC for it. WorkSafeBC decides.')} Read more: <a class="sr-ws-link sr-ws-link--arrow" href="${RTW_PATH}">Returning to work after a workplace injury</a></p></div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="clinics" aria-labelledby="sr-ws-clinics-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">Find your clinic</p><h2 class="sr-ws-h2" id="sr-ws-clinics-h">WCB physiotherapy at 19+ locations</h2>
      <p class="sr-ws-lede">Every clinic below books WCB physio assessments online. Pick the one nearest home or work.</p></div>
    ${finder(ctx)}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" aria-labelledby="sr-ws-more-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head"><p class="sr-ws-eyebrow">More WorkSafeBC care</p><h2 class="sr-ws-h2" id="sr-ws-more-h">Massage therapy and acupuncture on a WCB claim</h2></div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB massage therapy</h3>
        <p class="sr-ws-card__text">${c('WSBC-35', 'Needs a doctor&#8217;s referral and an accepted claim. WorkSafeBC covers an assessment and up to 6 treatments in the first 8 weeks after the injury without pre-approval.')}</p>
        <p class="sr-ws-card__text">${c('SYN-JANE', `WCB massage follow-up visits are bookable online at ${massage.join(', ')}.`)}</p></li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB acupuncture</h3>
        <p class="sr-ws-card__text">${c('SYN-JANE', `WCB acupuncture visits are bookable online at ${acu.join(', ')}.`)} ${c('WSBC-36', 'WorkSafeBC acupuncture needs an accepted claim and no referral.')}</p></li>
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="faq" aria-labelledby="sr-ws-faq-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><p class="sr-ws-eyebrow">FAQ</p><h2 class="sr-ws-h2" id="sr-ws-faq-h">WorkSafeBC physio questions</h2></div>
    <div class="sr-ws-faq sr-ws-faq--center">
      ${faq.map(([q, a]) => `<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">${q}</summary><div class="sr-ws-faq__a"><p>${a}</p></div></details>`).join('\n')}
    </div>
    <p class="sr-ws-center"><a class="sr-ws-link sr-ws-link--arrow" href="${GUIDE_PATH}">Claims, costs and coverage in detail</a></p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--tight" aria-labelledby="sr-ws-src-h">
  <div class="sr-ws-container">
    <h2 class="sr-ws-h4" id="sr-ws-src-h">Sources</h2>
    <ol class="sr-ws-sources">${Object.values(SOURCES).map((s) => `<li><a href="${s.url}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
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
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul><li><a href="${GUIDE_PATH}">What WorkSafeBC covers</a></li><li><a href="${RTW_PATH}">Return to work</a></li><li><a href="#faq">FAQ</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">Clinics</p><ul><li><a href="#clinics">Surrey (12)</a></li><li><a href="#clinics">Vancouver, Burnaby, New West</a></li><li><a href="#clinics">Richmond, Delta, Langley, Abbotsford</a></li></ul></div>
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
