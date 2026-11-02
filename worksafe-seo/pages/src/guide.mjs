// Coverage guide: /worksafebc-physiotherapy-what-is-covered/ . WorkSafe only.
// Owns claim and coverage questions (claim number, reporting, pending and denied claims, the 60-day rule,
// fees, non-contracted physios, extensions, massage and acupuncture rules, who decides what).
// The pillar owns the head term "WorkSafeBC physiotherapy"; this page leads with the coverage question.
// Every WorkSafeBC or Synergy fact is wrapped in ctx.claim(id, html). Ids come from data/claims-register.csv
// or data/claims-additions.csv (GUIDE-NN). No visit or week counts (WSBC-18/19/20 not cleared).
import { esc, icon, ev, SOURCES, PILLAR_PATH, GUIDE_PATH, AREAS } from './shared.mjs';

export const meta = {
  id: 'guide',
  path: GUIDE_PATH,
  title: 'What Does WorkSafeBC Cover for Physiotherapy? Claims & Costs',
  description: 'Claim numbers, pending and denied claims, fees and the 60-day rule. Plain answers on what WorkSafeBC pays for at physio, with links to official pages.',
  h1: 'What does WorkSafeBC cover for physiotherapy?',
};

const PT = 'guide';
const areaId = (a) => `area-${a.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-+$/, '')}`;

// Official pages cited on this page. URLs copied exactly from the claims register (or claims-additions.csv).
const SRC = {
  benefits: SOURCES.benefits,
  report: SOURCES.report,
  teleclaim: { title: 'Making a WorkSafeBC claim (information sheet)', url: 'https://www.worksafebc.com/resources/claims/information-sheet/making-worksafebc-claim?lang=en&direct=' },
  employers: { title: 'How employers report a workplace injury or disease', url: 'https://www.worksafebc.com/en/claims/report-workplace-injury-illness/how-employers-report-workplace-injury-illness' },
  form6: { title: 'Form 6: Application for Compensation and Report of Injury or Occupational Disease', url: 'https://www.worksafebc.com/en/resources/claims/forms/application-for-compensation-and-report-of-injury-or-occupational-disease-form-6' },
  form6a: { title: "Form 6A: Worker's Notice to Employer of Injury or Occupational Disease", url: 'https://www.worksafebc.com/en/resources/claims/forms/workers-report-of-injury-or-occupational-disease-to-employer-form-6a?lang=en' },
  msk: { title: 'Musculoskeletal physiotherapy services', url: 'https://www.worksafebc.com/en/health-care-providers/provider-types/physiotherapists/musculoskeletal-physiotherapy-services' },
  manual: { title: 'Physiotherapy Services Reference Manual', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-services-reference-manual?lang=en&direct=' },
  bulletin: { title: 'Bulletin 2026-28: new Physiotherapy Services Agreement resources', url: 'https://www.worksafebc.com/resources/health-care-providers/bulletins/2026-28-new-physiotherapy-services-agreement-resources-now-available?lang=en&direct=' },
  listMetro: { title: 'Contracted physiotherapy providers: Metro Vancouver', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/metro-vancouver?lang=en&direct=' },
  listFraser: { title: 'Contracted physiotherapy providers: Fraser Valley', url: 'https://www.worksafebc.com/resources/health-care-providers/guides/physiotherapy-provider-list/fraser-valley?lang=en&direct=' },
  massage: SOURCES.massage,
  acupuncture: { title: 'Acupuncturists: WorkSafeBC services', url: 'https://www.worksafebc.com/en/health-care-providers/provider-types/acupuncturists' },
  review: { title: 'Submitting a request for review', url: 'https://www.worksafebc.com/en/review-appeal/submit-request' },
  appealGuide: { title: 'Claims review and appeal guide for workers and dependants', url: 'https://www.worksafebc.com/en/resources/about-us/guides/claims-review-and-appeal-guide-for-workers-and-dependants?lang=en&direct=' },
};

const ext = (s, label) => `<a class="sr-ws-link sr-ws-link--ext" href="${s.url}">${label}</a>`;
const shortAnswer = (html) => `<div class="sr-ws-callout"><span class="sr-ws-label">Short answer</span><p>${html}</p></div>`;
const head = (eyebrow, id, q) => `<div class="sr-ws-head"><p class="sr-ws-eyebrow">${eyebrow}</p><h2 class="sr-ws-h2" id="${id}">${q}</h2></div>`;

export function guideFaq(ctx) {
  const c = ctx.claim;
  return [
    ['Is physio free with a WorkSafeBC claim?',
      `${c('WSBC-23', 'On an accepted claim, care related to your claim is billed to WorkSafeBC, and you should not have to pay any fees.')} ${c('WSBC-11', 'A contracted clinic also bills WorkSafeBC directly for your first assessment, even before the claim is accepted.')} ${c('WSBC-28', 'Treatment visits before acceptance are different: a clinic may ask you to pay, and you can ask for a refund if the claim is accepted later.')}`],
    ['How do WorkSafeBC claims work for physio?',
      `Here is the usual order. ${c('WSBC-42', 'Tell your employer.')} ${c('WSBC-43', 'Report the injury to WorkSafeBC online or by phone.')} ${c('WSBC-11', 'Book a first assessment with a contracted physio, even while the claim is pending.')} ${c('WSBC-46', 'Your 8-digit claim number comes by mail.')} ${c('WSBC-17', 'Treatment visits paid by WorkSafeBC start once the claim is accepted.')} ${c('WSBC-21', 'If you need more care later, your physio can ask WorkSafeBC for it.')}`],
    ['Do I need a doctor&#8217;s referral for WorkSafeBC physio?',
      `${c('WSBC-10', 'WorkSafeBC&#8217;s advice is simple: if you need physiotherapy, go to a physiotherapist who has a contract with WorkSafeBC and explain that your injury is work-related.')} ${c('WSBC-16', 'Seeing a doctor for a referral is not one of the steps it lists for physio.')} ${c('WSBC-35', 'Massage therapy is the exception. It needs a doctor&#8217;s referral.')}`],
    ['What if I have not reported my injury yet?',
      `Report it now. ${c('WSBC-13', 'There needs to be a WorkSafeBC claim, even a pending one, for the clinic to bill WorkSafeBC.')} ${c('WSBC-43', 'You can report online at any time, or call Teleclaim')} ${c('WSBC-44', 'at 1.888.967.5377, Monday to Friday, 8 a.m. to 6 p.m.')} ${c('WSBC-45', 'You have up to one year from the injury, but sooner is better.')}`],
    ['Do I have to tell my employer?',
      `${c('WSBC-42', 'Yes. WorkSafeBC asks you to tell your employer about the injury as soon as it is safe to do so.')} ${c('WSBC-47', 'Your employer then has to report it to WorkSafeBC within 72 hours if you missed work or needed care beyond first aid.')} ${c('GUIDE-02', 'Your employer may also ask you to fill in Form 6A, which goes to them, not to WorkSafeBC.')}`],
    ['I had surgery for my work injury. Can I start physio after it?',
      `${c('WSBC-12', 'Yes. A contracted physio can do a post-surgery assessment on your claim without asking WorkSafeBC first, as long as it is within 60 days of the surgery related to your claim.')} Bring any notes or exercise sheets your surgeon gave you, so your physio can follow them.`],
  ];
}

export function render(ctx) {
  const c = ctx.claim;
  const pillar = ctx.link('pillar') || PILLAR_PATH;
  const rtw = ctx.link('rtw');
  const clinics = `${PILLAR_PATH}#clinics`;
  const faq = guideFaq(ctx);
  const jump = [
    ['claim-number', 'Claim number'], ['report', 'Reporting'], ['pending', 'Pending claims'], ['denied', 'Denied claims'],
    ['after-60-days', 'After 60 days'], ['fees', 'Fees'], ['not-contracted', 'Non-contracted physios'],
    ['more-treatment', 'More treatment'], ['massage-acupuncture', 'Massage and acupuncture'], ['who-decides', 'Who decides'], ['faq', 'FAQ'],
  ];

  return `<div class="sr-ws-page">
<section class="sr-ws-band sr-ws-band--white sr-ws-hero" aria-labelledby="sr-ws-h1">
  <div class="sr-ws-container">
    <nav class="sr-ws-crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${pillar}">WorkSafeBC physiotherapy</a></li><li><span aria-current="page">What WorkSafeBC covers</span></li></ol></nav>
    <div class="sr-ws-hero__panel sr-ws-notch">
      <div class="sr-ws-notch__tab sr-ws-hero__badge"><span class="sr-ws-pill">Claims and costs guide</span></div>
      <div class="sr-ws-hero__content">
        <p class="sr-ws-eyebrow">Hurt at work in BC?</p>
        <h1 class="sr-ws-h1" id="sr-ws-h1">What does WorkSafeBC <span class="sr-ws-accent">cover</span> for physiotherapy?</h1>
        <p class="sr-ws-lede">${c('WSBC-23', 'Once WorkSafeBC accepts your claim, physio for your work injury is billed to WorkSafeBC, and you should not have to pay any fees.')} ${c('WSBC-11', 'You can have your first assessment at a contracted clinic while the claim is still pending.')} Below are plain answers to the claim and cost questions injured workers ask us most, with links to WorkSafeBC&#8217;s own pages.</p>
        <div class="sr-ws-hero__ctas">
          <a class="sr-ws-btn sr-ws-btn--primary sr-ws-btn--knob" href="${clinics}" ${ev('worksafe_location_select', 'all', 'hero', PT)}>Find your clinic<span class="sr-ws-btn__knob" aria-hidden="true">&#8594;</span></a>
          <a class="sr-ws-btn sr-ws-btn--secondary" href="#questions">Jump to your question</a>
        </div>
      </div>
      <div class="sr-ws-hero__media">
        <div class="sr-ws-card sr-ws-card--elevated">
          <p class="sr-ws-label">At a glance</p>
          <ul class="sr-ws-checklist" role="list">
            <li>${c('WSBC-11', 'Your claim can still be pending at your first assessment.')}</li>
            <li>${c('WSBC-23', 'Accepted claim: no fees for care related to your claim.')}</li>
            <li>${c('WSBC-14', 'More than 60 days since your injury? WorkSafeBC approves treatment first. You are not refused automatically.')}</li>
            <li>${c('WSBC-21', 'Need more treatment? Your physio can ask. WorkSafeBC decides.')}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white sr-ws-band--flush-top" id="questions" aria-label="On this page">
  <div class="sr-ws-container">
    <ul class="sr-ws-jumpnav" aria-label="On this page">${jump.map(([id, t]) => `<li><a href="#${id}">${t}</a></li>`).join('')}</ul>
    <p class="sr-ws-small sr-ws-muted">${c('GEN-01', 'WorkSafeBC is the Workers&#8217; Compensation Board of BC, so you will also see it called WCB.')} ${c('WSBC-01', 'WorkSafeBC&#8217;s physiotherapy rules changed on April 1, 2026.')} This page follows the current rules.</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="claim-number" aria-labelledby="sr-ws-claimno-h">
  <div class="sr-ws-container">
    ${head('Claim number', 'sr-ws-claimno-h', 'Do I need a WorkSafeBC claim number before I book physio?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`No, you do not need the number in hand. ${c('WSBC-11', 'At a contracted physiotherapist, you can have your first assessment before WorkSafeBC accepts your claim.')} ${c('WSBC-13', 'You do need to report the injury to WorkSafeBC first, so a claim exists, even if it is still pending.')} ${c('WSBC-46', 'WorkSafeBC mails you an 8-digit claim number once it gets your report.')} Bring it to a later visit if it has not arrived yet.`)}
      <p>When you book, tell the clinic the injury happened at work. ${c('WSBC-42', 'WorkSafeBC asks you to tell anyone who treats you that the injury happened at work.')} That way your visit is set up as a WorkSafeBC claim from the start.</p>
      <p class="sr-ws-tip"><span class="sr-ws-tip__label">Tip</span><span>When the letter with your claim number comes, take a photo of it. Then you will always have the number on your phone.</span></p>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="report" aria-labelledby="sr-ws-report-h">
  <div class="sr-ws-container">
    ${head('Reporting', 'sr-ws-report-h', 'How do I report a work injury to WorkSafeBC?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`${c('WSBC-42', 'First, tell your employer as soon as it is safe, and tell anyone who treats you that it happened at work.')} ${c('WSBC-43', 'Then report it to WorkSafeBC. You can report online any time, day or night, or by phone through Teleclaim.')} ${c('WSBC-45', 'You have up to one year from the injury to report it, but it is best to report right away.')}`)}
    </div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card sr-ws-card--soft"><h3 class="sr-ws-h3 sr-ws-card__title">Report online</h3>
        <p class="sr-ws-card__text">${c('WSBC-43', 'Online works best for a physical injury from one event, like a lift, a slip or a fall. It is open 24 hours a day, 7 days a week.')}</p>
        <p class="sr-ws-card__text">${c('WSBC-49', 'WorkSafeBC lists what to have ready, such as your Personal Health Number and how the injury happened.')}</p>
        <p class="sr-ws-card__foot">${ext(SRC.report, 'Report an injury on worksafebc.com')}</p></li>
      <li class="sr-ws-card sr-ws-card--soft"><h3 class="sr-ws-h3 sr-ws-card__title">Report by phone (Teleclaim)</h3>
        <p class="sr-ws-card__text">${c('WSBC-44', 'Call 1.888.967.5377 toll-free, or 604.231.8888 in the Lower Mainland. Lines are open Monday to Friday, 8 a.m. to 6 p.m.')}</p>
        <p class="sr-ws-card__text">${c('WSBC-43', 'The phone may suit you better for an injury that came on slowly, a mental health injury or hearing loss.')}</p>
        <p class="sr-ws-card__foot"><a class="sr-ws-link" href="tel:+18889675377">${icon('phone')}Call Teleclaim</a></p></li>
    </ul>
    <div class="sr-ws-prose">
      <h3 class="sr-ws-h3">What about Form 6 and Form 6A?</h3>
      <p>${c('WSBC-48', 'The paper Form 6 has been retired. Workers now report online or by phone.')} ${c('GUIDE-02', 'Form 6A is a notice you give to your employer, not to WorkSafeBC. Your employer may ask you to fill it in.')} We do not copy forms onto this page. Use WorkSafeBC&#8217;s own pages so you always get the current version.</p>
      <ul><li>${ext(SRC.form6, 'Form 6 page on worksafebc.com')}</li><li>${ext(SRC.form6a, 'Form 6A page on worksafebc.com')}</li></ul>
      <p>${c('WSBC-47', 'Your employer has its own duty: it must report the injury to WorkSafeBC within 72 hours if you missed work or needed care beyond first aid.')}</p>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="pending" aria-labelledby="sr-ws-pending-h">
  <div class="sr-ws-container">
    ${head('Pending claims', 'sr-ws-pending-h', 'Can I start physio while my claim is pending, and will I pay?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`Yes, you can start. ${c('WSBC-12', 'A contracted physiotherapist can do your first assessment on a pending claim, with no prior approval, if it is within 60 days of your injury.')} ${c('WSBC-11', 'The clinic bills WorkSafeBC directly for that assessment.')} ${c('WSBC-17', 'Treatment visits paid by WorkSafeBC start once your claim is accepted.')} ${c('WSBC-28', 'Before then, a clinic may ask you to pay for treatment. If your claim is accepted later, you can ask the clinic for a refund.')}`)}
      <p>So a pending claim is not a reason to wait in pain. You can get assessed, learn what is going on and start the exercises you can do at home.</p>
    </div>
    <div class="sr-ws-box"><p class="sr-ws-box__head">Before you book follow-up visits <span class="sr-ws-pill sr-ws-pill--blue">Pending claim</span></p>
      <div class="sr-ws-box__body"><ul class="sr-ws-checklist" role="list">
        <li>${c('SYN-PEND', 'Ask the clinic how it handles visits while your claim is pending.')}</li>
        <li>Keep every receipt if you pay for a visit.</li>
        <li>${c('WSBC-28', 'If your claim is accepted, contact the clinic to ask for your money back.')}</li>
      </ul></div></div>
    ${ctx.finderCompact()}
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="denied" aria-labelledby="sr-ws-denied-h">
  <div class="sr-ws-container">
    ${head('Denied claims', 'sr-ws-denied-h', 'What happens if my WorkSafeBC claim is denied?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`${c('WSBC-29', 'If your claim was pending at your first visit, WorkSafeBC still pays a contracted clinic for that first assessment, even if the claim is later denied.')} ${c('WSBC-30', 'WorkSafeBC does not pay for treatment visits given while the claim was pending. Each clinic decides whether to ask you to pay for those visits or to wait for the decision before treating you.')} ${c('GUIDE-01', 'If you disagree with the decision, you can ask for a review within 90 days.')}`)}
      <p>A denied claim is hard news, especially when you are still sore. Read the decision letter closely, because it explains the reason. ${c('GUIDE-01', 'The 90 days for a review count from the date of the decision.')} ${c('GUIDE-03', 'You can also contact the Workers&#8217; Advisers Office for advice at any stage of your claim.')}</p>
      <ul><li>${ext(SRC.review, 'How to ask WorkSafeBC for a review')}</li><li>${ext(SRC.appealGuide, 'WorkSafeBC review and appeal guide for workers')}</li></ul>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="after-60-days" aria-labelledby="sr-ws-60-h">
  <div class="sr-ws-container">
    ${head('The 60-day rule', 'sr-ws-60-h', 'Can I still get physio more than 60 days after my injury?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`Yes. ${c('WSBC-14', 'When treatment starts more than 60 days after the injury, WorkSafeBC has to approve it before it begins. It is not refused automatically, so 60 days is not a deadline for your claim.')} ${c('WSBC-12', 'The 60 days is the window in which a contracted physio can do your first assessment without asking WorkSafeBC first.')} Tell the clinic your injury date when you book.`)}
      <p>You may read online that WorkSafeBC physio only works in the first 60 days. That is not how the rules read. ${c('WSBC-14', 'After 60 days, approval comes first. Your care is not cut off.')} ${c('WSBC-12', 'If you have surgery related to your claim, the 60 days can also count from the surgery date.')}</p>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="fees" aria-labelledby="sr-ws-fees-h">
  <div class="sr-ws-container">
    ${head('Fees', 'sr-ws-fees-h', 'Will I pay anything once my claim is accepted?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`${c('WSBC-23', 'Once WorkSafeBC accepts your claim, your clinic bills WorkSafeBC for care related to your claim, and you should not have to pay any fees.')} ${c('WSBC-24', 'A clinic with a WorkSafeBC contract is not allowed to charge you extra for services under that contract, such as a top-up or user fee.')} Costs can still come up in a few cases, listed below.`)}
      <h3 class="sr-ws-h3">When you might pay something</h3>
      <ul>
        <li><strong>While your claim is pending.</strong> ${c('WSBC-28', 'A clinic may ask you to pay for treatment visits until the claim is accepted.')} <a href="#pending">How pending claims work</a></li>
        <li><strong>Care for a body area that is not part of your claim.</strong> ${c('WSBC-25', 'Treatment for an area that is not part of your accepted claim can be billed to you.')}</li>
        <li><strong>A physio without a WorkSafeBC contract.</strong> ${c('WSBC-26', 'WorkSafeBC repays you at its set rate, and you pay any difference.')} <a href="#not-contracted">Non-contracted physios</a></li>
      </ul>
      <p>If you are not sure whether a visit is covered, ask the front desk before your appointment. A good clinic will give you a straight answer.</p>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="not-contracted" aria-labelledby="sr-ws-nc-h">
  <div class="sr-ws-container">
    ${head('Choosing a physio', 'sr-ws-nc-h', 'Can I use a physio who is not contracted with WorkSafeBC?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`You can, but it may cost you. ${c('WSBC-10', 'WorkSafeBC asks workers who need physiotherapy to visit a physiotherapist who has a contract with WorkSafeBC in their region.')} ${c('WSBC-26', 'If you choose one who is not contracted, you pay for each visit and then ask WorkSafeBC to pay you back. WorkSafeBC repays at its set rate, $95 per visit from April 1, 2026, and you pay any difference.')}`)}
      <p>${c('WSBC-24', 'That &#8220;you pay the difference&#8221; rule is for physios without a contract. A contracted clinic cannot charge you extra for services under its WorkSafeBC contract.')}</p>
      <h3 class="sr-ws-h3">How to check if a clinic is contracted</h3>
      <p>${c('WSBC-33', 'WorkSafeBC publishes regional lists of physiotherapy clinics contracted for musculoskeletal care, for example Metro Vancouver and the Fraser Valley.')} ${c('WSBC-34', 'It keeps separate lists for other programs, so being on one list does not mean a clinic is on another.')} You can also simply ask the clinic when you call.</p>
      <ul><li>${ext(SRC.listMetro, 'Metro Vancouver provider list')}</li><li>${ext(SRC.listFraser, 'Fraser Valley provider list')}</li></ul>
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="more-treatment" aria-labelledby="sr-ws-more-h">
  <div class="sr-ws-container">
    ${head('Extensions', 'sr-ws-more-h', 'How much physio does WorkSafeBC cover, and can I get more?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`${c('WSBC-21', 'WorkSafeBC decides how much physiotherapy your claim covers. If you need more, your physiotherapist can ask WorkSafeBC for it, and WorkSafeBC decides whether to approve the request.')} ${c('WSBC-01', 'WorkSafeBC&#8217;s physiotherapy rules changed on April 1, 2026,')} so a visit number you saw on an older page may not apply to you. Ask your physiotherapist what is approved for your claim right now.`)}
      <p>${c('SYN-05', 'If your physiotherapist thinks you need more treatment, they can request it as part of your treatment plan. WorkSafeBC decides.')} Your part is to keep your visits, do your home exercises and tell your physio how your work tasks feel. That helps your physio plan the next step with you.</p>
      ${rtw ? `<p>Going back to work while you recover? Read <a class="sr-ws-link sr-ws-link--arrow" href="${rtw}">Returning to work after a workplace injury</a>.</p>` : ''}
    </div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft" id="massage-acupuncture" aria-labelledby="sr-ws-ma-h">
  <div class="sr-ws-container">
    ${head('Other care on a claim', 'sr-ws-ma-h', 'Does WorkSafeBC cover massage therapy or acupuncture?')}
    <div class="sr-ws-prose">
      ${shortAnswer(`It can, but the rules are not the same as for physio. ${c('WSBC-35', 'WorkSafeBC massage therapy needs a doctor&#8217;s referral and an accepted claim.')} ${c('WSBC-36', 'WorkSafeBC acupuncture needs an accepted claim but no referral. The treatment has to suit your accepted injury and focus on active rehab and getting back to work.')} For either one, check what is approved on your claim before you book.`)}
    </div>
    <ul class="sr-ws-grid sr-ws-grid--2 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB massage therapy</h3>
        <p class="sr-ws-card__text">${c('WSBC-35', 'You need a doctor&#8217;s referral and an accepted claim before treatment starts. More treatment after the first set needs WorkSafeBC approval.')}</p>
        <p class="sr-ws-card__foot">${ext(SRC.massage, 'Massage therapy on worksafebc.com')}</p></li>
      <li class="sr-ws-card"><h3 class="sr-ws-h3 sr-ws-card__title">WCB acupuncture</h3>
        <p class="sr-ws-card__text">${c('WSBC-36', 'You need an accepted claim. No referral is needed. Past the first set of visits, a WorkSafeBC officer has to approve more.')}</p>
        <p class="sr-ws-card__foot">${ext(SRC.acupuncture, 'Acupuncture on worksafebc.com')}</p></li>
    </ul>
    <div class="sr-ws-note"><p>See which of our clinics book WCB massage or acupuncture on our <a class="sr-ws-link" href="${pillar}">WorkSafeBC physiotherapy page</a>.</p></div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" id="who-decides" aria-labelledby="sr-ws-who-h">
  <div class="sr-ws-container">
    ${head('Who does what', 'sr-ws-who-h', 'What does Synergy do, and what does WorkSafeBC decide?')}
    <div class="sr-ws-prose">
      <p class="sr-ws-lede">Our physiotherapists assess and treat your injury and build a plan around your job. ${c('SYN-08', 'We bill WorkSafeBC for your care.')} ${c('WSBC-17', 'WorkSafeBC decides whether your claim is accepted,')} ${c('WSBC-21', 'and whether to approve more treatment if you need it.')} You report the injury and keep your employer and WorkSafeBC up to date. If you are not sure who to ask, start with us and we will point you the right way.</p>
    </div>
    <ul class="sr-ws-grid sr-ws-grid--3 sr-ws-list-reset" role="list">
      <li class="sr-ws-card"><span class="sr-ws-icon-well">${icon('users')}</span><h3 class="sr-ws-h3 sr-ws-card__title">You</h3>
        <ul class="sr-ws-checklist" role="list">
          <li>${c('WSBC-42', 'Tell your employer as soon as it is safe.')}</li>
          <li>${c('WSBC-43', 'Report the injury to WorkSafeBC online or through Teleclaim.')}</li>
          <li>${c('WSBC-46', 'Bring your 8-digit claim number once it arrives.')}</li>
          <li>Keep receipts for anything you pay while the claim is pending.</li>
        </ul></li>
      <li class="sr-ws-card"><span class="sr-ws-icon-well">${icon('shield')}</span><h3 class="sr-ws-h3 sr-ws-card__title">Synergy Rehab</h3>
        <ul class="sr-ws-checklist" role="list">
          <li>Assess your injury and what your job asks of your body.</li>
          <li>${c('SYN-08', 'Bill WorkSafeBC for your physiotherapy.')}</li>
          <li>${c('SYN-09', 'On an accepted claim, no user fees for your claim-related physio.')}</li>
          <li>${c('SYN-05', 'Ask WorkSafeBC for more treatment if your physio thinks you need it. WorkSafeBC decides.')}</li>
          <li>${c('SYN-PEND', 'Tell you how we handle visits while your claim is pending.')}</li>
        </ul></li>
      <li class="sr-ws-card"><span class="sr-ws-icon-well">${icon('doc')}</span><h3 class="sr-ws-h3 sr-ws-card__title">WorkSafeBC</h3>
        <ul class="sr-ws-checklist" role="list">
          <li>${c('WSBC-17', 'Whether your claim is accepted. Paid treatment visits start after that.')}</li>
          <li>${c('WSBC-21', 'Whether to approve more treatment.')}</li>
          <li>${c('WSBC-14', 'Whether treatment can start when it is more than 60 days since the injury.')}</li>
          <li>${c('WSBC-26', 'What it repays if you see a physio who is not contracted.')}</li>
          <li>${c('GUIDE-01', 'A review of a decision, if you ask within 90 days.')}</li>
        </ul></li>
    </ul>
    <div class="sr-ws-note"><p>${c('WSBC-17', 'Only WorkSafeBC can accept or deny your claim.')} Our team cannot speed up a decision. If something is unclear, ask us and we will help you work out what to ask WorkSafeBC.</p></div>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--white" id="faq" aria-labelledby="sr-ws-faq-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><p class="sr-ws-eyebrow">FAQ</p><h2 class="sr-ws-h2" id="sr-ws-faq-h">What else do injured workers ask about coverage?</h2></div>
    <div class="sr-ws-faq sr-ws-faq--center">
      ${faq.map(([q, a]) => `<details class="sr-ws-faq__item"><summary class="sr-ws-faq__q">${q}</summary><div class="sr-ws-faq__a"><p>${a}</p></div></details>`).join('\n')}
    </div>
    <ul class="sr-ws-related${rtw ? ' sr-ws-related--3' : ''}" role="list">
      <li><a class="sr-ws-related__link" href="${pillar}#eligibility">How WCB physio works at each claim stage<span class="sr-ws-related__meta">WorkSafeBC physiotherapy at Synergy Rehab</span></a></li>
      ${rtw ? `<li><a class="sr-ws-related__link" href="${rtw}">Returning to work after a workplace injury<span class="sr-ws-related__meta">Gradual return and modified duties</span></a></li>` : ''}
      <li><a class="sr-ws-related__link sr-ws-related__link--ext" href="${SRC.benefits.url}">Health care benefits for workers<span class="sr-ws-related__meta">worksafebc.com</span></a></li>
    </ul>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--soft sr-ws-band--tight" aria-labelledby="sr-ws-src-h">
  <div class="sr-ws-container">
    <h2 class="sr-ws-h4" id="sr-ws-src-h">Where do these facts come from?</h2>
    <p class="sr-ws-small">Every rule on this page comes from WorkSafeBC&#8217;s own pages, listed here. If anything here and WorkSafeBC&#8217;s site ever differ, WorkSafeBC&#8217;s site is right.</p>
    <ol class="sr-ws-sources">${Object.values(SRC).map((s) => `<li><a href="${s.url}">${esc(s.title)}</a> (worksafebc.com)</li>`).join('')}</ol>
    <p class="sr-ws-asof">${ctx.asof()}</p>
  </div>
</section>

<section class="sr-ws-band sr-ws-band--blue" aria-labelledby="sr-ws-cta-h">
  <div class="sr-ws-container">
    <div class="sr-ws-head sr-ws-head--center"><h2 class="sr-ws-h2" id="sr-ws-cta-h">Hurt at work? Start with an assessment.</h2>
      <p class="sr-ws-lede">${c('WSBC-11', 'You can have your first assessment while your claim is pending.')} Pick the clinic nearest home or work.</p></div>
    <a class="sr-ws-bigpill sr-ws-hide-below-desktop" href="${clinics}" ${ev('worksafe_location_select', 'all', 'final', PT)}>Find your clinic</a>
    <div class="sr-ws-linkcols">
      <div><p class="sr-ws-linkcols__title">Synergy Rehabilitation</p><p class="sr-ws-small">19+ locations from Vancouver to Abbotsford.</p></div>
      <div><p class="sr-ws-linkcols__title">WorkSafe</p><ul><li><a href="${pillar}">WorkSafeBC physiotherapy</a></li>${rtw ? `<li><a href="${rtw}">Return to work</a></li>` : ''}<li><a href="#faq">Coverage FAQ</a></li></ul></div>
      <div><p class="sr-ws-linkcols__title">Clinics</p><ul>${AREAS.map(([a]) => `<li><a href="${PILLAR_PATH}#${areaId(a)}">${esc(a)}</a></li>`).join('')}</ul></div>
      <div><p class="sr-ws-linkcols__title">WorkSafeBC</p><ul><li><a href="${SRC.report.url}">Report an injury</a></li><li><a href="tel:+18889675377">${c('WSBC-44', 'Teleclaim 1.888.967.5377')}</a></li><li><a href="${SRC.review.url}">Ask for a review</a></li></ul></div>
    </div>
  </div>
</section>

<div class="sr-ws-sticky" role="region" aria-label="Find a WorkSafe clinic">
  <a class="sr-ws-btn sr-ws-btn--primary" href="${clinics}" ${ev('worksafe_location_select', 'all', 'sticky', PT)}>Find your clinic</a>
</div>
<div class="sr-ws-sticky-spacer"></div>
</div>`;
}
